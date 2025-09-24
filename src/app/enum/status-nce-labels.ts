import { StatusNce } from './status-nce.enum';

export const StatusNceLabels: Record<StatusNce, string> = {
  [StatusNce.CRIADA]: 'Criada',
  [StatusNce.EM_ANALISE_CMT]: 'Em análise (CMT)',
  [StatusNce.DEFERIDO_CMT]: 'Deferido pelo CMT',
  [StatusNce.INDEFERIDO_CMT]: 'Indeferido pelo CMT',
  [StatusNce.EM_ANALISE_CADESM]: 'Em análise (CADESM)',
  [StatusNce.DEFERIDO_CADESM]: 'Deferido pela CADESM',
  [StatusNce.INDEFERIDO_CADESM]: 'Indeferido pela CADESM',
  [StatusNce.EM_ANALISE_DIRETORIA]: 'Em análise (Diretoria)',
  [StatusNce.DEFERIDO_DIRETORIA]: 'Deferido pela Diretoria',
  [StatusNce.INDEFERIDO_DIRETORIA]: 'Indeferido pela Diretoria',
  [StatusNce.EM_ANALISE_EME]: 'Em análise (EME)',
  [StatusNce.APROVADO_EME]: 'Aprovado pelo EME',
  [StatusNce.REPROVADO_EME]: 'Reprovado pelo EME',
  [StatusNce.LIBERADO_CANDIDATO]: 'Liberado ao candidato',
  [StatusNce.DELETADO]: 'Deletado'
};
