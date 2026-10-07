# FisioPélvica — Assistente Clínico

MVP web para auxiliar o fisioterapeuta na organização de atendimentos de fisioterapia pélvica.

## O que este MVP faz
- Cadastro e seleção de pacientes
- Triagem/anamnese
- Avaliação funcional estruturada
- Objetivos terapêuticos
- Registro de sessões e evolução
- Biblioteca inicial de exercícios
- Backup/importação local em JSON
- Área de privacidade e segurança

## Importante
Este sistema é um protótipo de apoio à documentação e organização. Não realiza diagnóstico automático e não prescreve tratamento de forma autônoma. A decisão clínica, indicação, técnica, carga, contraindicações e encaminhamentos são responsabilidade do fisioterapeuta.

O MVP guarda dados somente no navegador. Não use dados reais de pacientes até implementarmos autenticação, banco seguro, controle de acesso, auditoria, criptografia, backup e requisitos de privacidade/LGPD.

## Desenvolvimento
```bash
npm install
npm run dev
```

## Estrutura
```
src/
  data/exercises.js
  app.js
  main.js
  styles.css
docs/
  PRODUCT.md
  SECURITY.md
index.html
package.json
```
