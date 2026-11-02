/* Configuração do Supabase (chave anon public, nunca a service_role) */
const SUPABASE_URL = "https://rfefpkfmkjjbnumqbnmr.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZWZwa2Zta2pqYm51bXFibm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0OTIyOTUsImV4cCI6MjEwOTA2ODI5NX0.E0hccAHxovQXk8zPVkENRYnAq5U-Ja2IjDrtuwSjorA";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------- TEMA (claro / escuro) ---------- */
const CHAVE_TEMA = "hub-tema";

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CHAVE_TEMA, tema);
}

function botaoTema() {
  const b = document.createElement("button");
  b.className = "tema-btn";
  const rotulo = () => {
    b.textContent =
      document.documentElement.dataset.tema === "claro"
        ? "☾ Escuro"
        : "☀ Claro";
  };
  b.onclick = () => {
    aplicarTema(
      document.documentElement.dataset.tema === "claro" ? "escuro" : "claro",
    );
    rotulo();
  };
  rotulo();
  return b;
}

/* ---------- SESSÃO ---------- */
// Usado no hub: se não há login, manda para a página de entrar
async function exigirLogin() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session) {
    location.replace("entrar.html");
    return null;
  }
  return session.user;
}

// Usado nas páginas de login e cadastro: se já há login, vai para o hub
async function pularSeLogado() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (session) location.replace("hub.html");
}

/* ---------- MENSAGENS DE ERRO EM PORTUGUÊS ---------- */
function traduzirErro(m = "") {
  if (/Invalid login/i.test(m)) return "E-mail ou senha incorretos.";
  if (/Email not confirmed/i.test(m))
    return "Confirme seu e-mail antes de entrar.";
  if (/already (been )?registered/i.test(m))
    return "Este e-mail já tem uma conta.";
  if (/at least 6|Password should be/i.test(m))
    return "A senha precisa ter no mínimo 6 caracteres.";
  if (/rate limit|too many/i.test(m))
    return "Muitas tentativas. Aguarde um pouco.";
  return m;
}
