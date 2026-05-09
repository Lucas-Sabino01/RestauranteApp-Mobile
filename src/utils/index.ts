import type { Estabelecimento } from '../types';

/**
 * Mapeamento de dias da semana (JS) para abreviações no horário
 */
const DIAS_SEMANA: Record<number, string[]> = {
  0: ['dom', 'domingo'],
  1: ['seg', 'segunda'],
  2: ['ter', 'terça', 'terca'],
  3: ['qua', 'quarta'],
  4: ['qui', 'quinta'],
  5: ['sex', 'sexta'],
  6: ['sab', 'sáb', 'sabado', 'sábado'],
};

/**
 * Converte string de hora "7h", "19h30", "0h" para minutos desde meia-noite
 */
function parseHora(horaStr: string): number {
  const cleaned = horaStr.trim().toLowerCase().replace('h', ':');
  const parts = cleaned.split(':').filter(Boolean);
  const horas = parseInt(parts[0], 10) || 0;
  const minutos = parseInt(parts[1], 10) || 0;
  return horas * 60 + minutos;
}

/**
 * Verifica se o dia da semana atual está dentro de um intervalo como "Seg-Sex", "Ter-Dom", "Sáb"
 */
function isDiaIncluido(diaStr: string, diaSemana: number): boolean {
  const lower = diaStr.toLowerCase().trim();

  // Intervalo: "seg-sex", "ter-dom"
  if (lower.includes('-')) {
    const [inicio, fim] = lower.split('-').map((d) => d.trim());
    const diaInicio = findDiaNumero(inicio);
    const diaFim = findDiaNumero(fim);
    if (diaInicio === -1 || diaFim === -1) return false;

    if (diaInicio <= diaFim) {
      return diaSemana >= diaInicio && diaSemana <= diaFim;
    }
    // Wrap around: "sex-dom" = sex(5), sab(6), dom(0)
    return diaSemana >= diaInicio || diaSemana <= diaFim;
  }

  // Dia único: "sáb", "dom"
  const num = findDiaNumero(lower);
  return num === diaSemana;
}

function findDiaNumero(diaStr: string): number {
  const lower = diaStr.toLowerCase().trim();
  for (const [num, aliases] of Object.entries(DIAS_SEMANA)) {
    if (aliases.some((alias) => lower.startsWith(alias))) {
      return parseInt(num, 10);
    }
  }
  return -1;
}

/**
 * Analisa o campo `horario` de um estabelecimento e retorna se está aberto agora.
 * Formato esperado: "Seg-Sex 7h-19h | Sáb 8h-17h" ou "Seg-Dom 7h-20h"
 */
export function getOpenStatus(horario: string): { isOpen: boolean; label: string } {
  const now = new Date();
  const diaSemana = now.getDay(); // 0=dom, 1=seg...6=sab
  const minutosAgora = now.getHours() * 60 + now.getMinutes();

  // Separa os blocos por "|"
  const blocos = horario.split('|').map((b) => b.trim());

  for (const bloco of blocos) {
    // Separa dia(s) de hora(s): "Seg-Sex 7h-19h" ou "Seg-Sáb 11h30-15h | 18h30-23h"
    // Encontrar os ranges de hora neste bloco
    const horaMatches = bloco.match(/\d{1,2}h\d{0,2}\s*-\s*\d{1,2}h\d{0,2}/g);
    if (!horaMatches) continue;

    // O texto antes do primeiro horário são os dias
    const primeiraHora = horaMatches[0];
    const diaTexto = bloco.substring(0, bloco.indexOf(primeiraHora)).trim();

    if (!isDiaIncluido(diaTexto, diaSemana)) continue;

    // Verificar cada intervalo de hora
    for (const horaRange of horaMatches) {
      const [horaInicio, horaFim] = horaRange.split('-').map(parseHora);

      if (horaFim > horaInicio) {
        // Horário normal: 7h-19h
        if (minutosAgora >= horaInicio && minutosAgora < horaFim) {
          return { isOpen: true, label: 'Aberto' };
        }
      } else {
        // Horário que cruza meia-noite: 17h-2h
        if (minutosAgora >= horaInicio || minutosAgora < horaFim) {
          return { isOpen: true, label: 'Aberto' };
        }
      }
    }
  }

  return { isOpen: false, label: 'Fechado' };
}

/**
 * Atalho para verificar se está aberto
 */
export function isOpenNow(horario: string): boolean {
  return getOpenStatus(horario).isOpen;
}

/**
 * Gera texto formatado para compartilhamento
 */
export function formatShareText(estabelecimento: Estabelecimento): string {
  const stars = '⭐'.repeat(Math.floor(estabelecimento.avaliacao));
  return (
    `🍽️ ${estabelecimento.nome}\n\n` +
    `${estabelecimento.descricao}\n\n` +
    `📍 ${estabelecimento.endereco} — ${estabelecimento.bairro}\n` +
    `📞 ${estabelecimento.telefone}\n` +
    `🕐 ${estabelecimento.horario}\n` +
    `${stars} ${estabelecimento.avaliacao}/5\n\n` +
    `Encontrei no Guia Curitiba! 🏙️`
  );
}

/**
 * Calcula a distância em km entre duas coordenadas usando a fórmula de Haversine
 */
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formata a distância para exibição amigável (km ou m)
 */
export function formatarDistancia(distanciaEmKm: number): string {
  if (distanciaEmKm < 1) {
    return `${Math.round(distanciaEmKm * 1000)}m`;
  }
  return `${distanciaEmKm.toFixed(1).replace('.', ',')} km`;
}

/**
 * Mapeamento de categoria para emoji — usado nos marcadores do mapa e chips de busca
 */
export const CATEGORY_EMOJI: Record<string, string> = {
  'Cafeterias': '☕',
  'Restaurantes': '🍽️',
  'Bares': '🍻',
  'Padarias': '🥐',
  'Docerias': '🍰',
};

/**
 * Retorna as iniciais do nome para uso em avatares placeholder
 */
export function getInitials(nome: string): string {
  return nome
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
