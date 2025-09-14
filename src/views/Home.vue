<script setup>

function tempoRestanteToken() {
  const token = localStorage.getItem('token');

  if (!token) return 0;

  try {
    const decoded = decodeToken(token);
    if (!decoded.exp) return 0;
    const agora = Date.now() / 1000; // em segundos
    const tempoRestante = decoded.exp - agora;
    return tempoRestante > 0 ? tempoRestante : 0;
  } catch (error) {
    console.error('Token inválido:', error);
    return 0;
  }
}

function decodeToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadDecoded);
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}

</script>

<template>

  <h3>Home</h3>
  Tempo da sessao: {{ tempoRestanteToken() }}
</template>