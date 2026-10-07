# Segurança

O MVP é para desenvolvimento e demonstração. Não deve armazenar dados reais de pacientes em produção.

Antes de produção:
- autenticação forte e MFA;
- autorização por perfil;
- criptografia em trânsito e repouso;
- gestão segura de segredos;
- logs de auditoria;
- backup e recuperação;
- política de retenção e eliminação;
- validação de entrada e proteção contra XSS/CSRF;
- revisão de privacidade e LGPD;
- ambientes separados de desenvolvimento, homologação e produção.

Nunca coloque prontuários, nomes, telefones ou outros dados clínicos reais em commits, issues, logs ou repositórios públicos.
