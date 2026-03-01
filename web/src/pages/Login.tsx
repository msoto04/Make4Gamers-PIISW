import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //Funcion envio del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validaciones Frontend básicas
    if (!password) {
      setError("Por favor, ingrese la contraseña.");
      return;
    }

    if (!email) {
      setError("Por favor, rellene su email");
      return;
    }

    if (!email || !password) {
      setError("Por favor, introduce tu email y contraseña.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, introduce un email válido.");
      return;
    }

    setIsLoading(true);

    //Backend Supabase
    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (supabaseError) {
      setIsLoading(false);
      if (supabaseError.message === "Invalid login credentials") {
        setError("Credenciales incorrectas, revise los campos");
      } else {
        setError(supabaseError.message);
      }
      return;
    }

    //Acceso al panel
    if (data.user) {
      navigate("/panel"); //Cambiar /panel por la ruta real
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2a2e40] p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Iniciar Sesión
        </h2>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white-700 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c29] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#615fff] focus:border-[#615fff] outline-none transition-all placeholder-gray-500"
              placeholder="Correo Electronico"
              disabled={isLoading}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-white-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c29] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#615fff] focus:border-[#615fff] outline-none transition-all placeholder-gray-500"
              placeholder="Contraseña"
              disabled={isLoading}
            />
          </div>

          {/* Recuperar Contraseña */}
          <div className="flex justify-end">
            <Link
              to="/recuperar-password"
              className="text-sm font-medium text-[#615fff] hover:text-white transition-colors"
            >
              ¿Olvidaste la contraseña?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
              ${isLoading 
                ? "bg-[#615fff] cursor-not-allowed" 
                : "bg-[#615fff] hover:bg-[#4d4beb] active:transform active:scale-95"
              }`}
          >
            {isLoading ? "Iniciando sesion" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}