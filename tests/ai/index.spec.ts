// AI suite entrypoint.
// If one of these tests fails, start by checking OPENROUTER_API_KEY, the helper logs, and whether
// the failure is caused by invalid AI-generated data or by the application under test.
import '../facturacion-clientes-auth.ai.spec';
import '../facturacion-clientes-ui.ai.spec';
import '../facturacion-facturas-auth.ai.spec';
import '../facturacion-facturas-ui.ai.spec';
import '../login-administrador.ai.spec';
import '../login-user-cerrarsesion.ai.spec';
import '../login-usuario.ai.spec';
import '../pago-crear-ui.ai.spec';
import '../parqueaderos.ai.spec';
import '../reservas-buscar-parqueadero.ai.spec';
import '../reservas-crear.ai.spec';
import '../tarifa-buscar-parqueadero.ai.spec';
import '../tarifa-crear-ui.ai.spec';
import '../tarifa-modificar-ui.ai.spec';
import '../usuario-reserva-crear-vehiculoexistente.ai.spec';
import '../usuario-reserva-crear-vehiculonuevo.ai.spec';
import '../vehiculos-crear.ai.spec';
import '../vistas-historialreservas.ai.spec';
