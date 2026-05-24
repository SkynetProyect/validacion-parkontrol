import json
import os
import sys
from textwrap import dedent

from deepeval.metrics import GEval
from deepeval.models import OpenRouterModel
from deepeval.test_case import LLMTestCase, SingleTurnParams


def build_criteria(payload: dict) -> str:
    scenario = payload.get("scenario", "")
    return dedent(
        f"""
        Evaluate whether the proposed JSON values are realistic, natural, and context-appropriate for the Playwright scenario.

        Scenario:
        {scenario}

        Score high only when the values look human-generated, match the requested intent, and avoid synthetic placeholders.
        For negative or failure-intent cases, penalize candidates that make unrelated fields invalid or that fail to keep the failure localized.
        """
    ).strip()


def main() -> int:
    raw_input = sys.stdin.read().strip()
    if not raw_input:
        print(json.dumps({"score": 0, "reason": "No payload was provided.", "success": False}))
        return 1

    payload = json.loads(raw_input)
    candidate = payload.get("candidate", {})

    model_name = os.getenv("DEEPEVAL_MODEL") or os.getenv("OPENROUTER_MODEL") or "poolside/laguna-m.1:free"
    api_key = os.getenv("OPENROUTER_API_KEY")
    base_url = os.getenv("DEEPEVAL_BASE_URL") or os.getenv("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1"

    if not api_key:
        print(json.dumps({"score": 0, "reason": "OPENROUTER_API_KEY is required for DeepEval validation.", "success": False}))
        return 1

    model = OpenRouterModel(model=model_name, api_key=api_key, base_url=base_url)
    metric = GEval(
        name="AI Playwright value realism",
        criteria=build_criteria(payload),
        evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
        model=model,
        threshold=0.7,
        async_mode=False,
        strict_mode=False,
        verbose_mode=False,
    )

    test_case = LLMTestCase(
        input=json.dumps(
            {
                "systemPrompt": payload.get("systemPrompt"),
                "scenario": payload.get("scenario"),
                "intent": payload.get("intent"),
                "failureReason": payload.get("failureReason"),
                "fields": payload.get("fields"),
            },
            ensure_ascii=False,
            indent=2,
        ),
        actual_output=json.dumps(candidate, ensure_ascii=False, indent=2),
    )

    metric.measure(test_case, _show_indicator=False, _log_metric_to_confident=False)
    print(
        json.dumps(
            {
                "score": metric.score,
                "reason": metric.reason,
                "success": metric.is_successful(),
            },
            ensure_ascii=False,
        )
    )
    return 0 if metric.is_successful() else 2


if __name__ == "__main__":
    raise SystemExit(main())
