import { useEffect, useState } from "react";

import caminho from "../../assets/imagens/caminho.png";
import caminhoAtencao from "../../assets/imagens/caminho-atencao.png";
import caminhoCritico from "../../assets/imagens/caminho-critico.png";

import { MetricCards } from "../MetricCards";
import {
  useTransactions,
  useBalances,
  usePeriods,
  useCompanies,
} from "../../context";

import { getIndicatorsPeriod } from "../../utils/financialIndicators";
import {
  DaysStability,
  RunwayBadge,
  RunwayTimeline,
  RunwayPathImage,
  RunwayGoal,
} from "./CashRunwayCard";

import { EmotionalStateCard } from "./EmotionalStateCard";

import { emotionalStates } from "../../constants/emotionalStates";


const getMarkerPosition = (days) => {
  const safeDays = Math.max(0, Math.min(days, 90));
  const position = (safeDays / 90) * 100;

  return `${position}%`;
};

const getRunwayStatus = (days) => {
  if (days >= 90) {
    return {
      key: "estavel",
      label: "Zona Segura",
      color: "text-success",
      bg: "bg-success-soft",
      image: caminho,
      markerPosition: getMarkerPosition(days),
    };
  }

  if (days >= 60) {
    return {
      key: "estavel",
      label: "Zona Estável",
      color: "text-success",
      bg: "bg-success-soft",
      image: caminho,
      markerPosition: getMarkerPosition(days),
    };
  }

  if (days >= 30) {
    return {
      key: "sobpressao",
      label: "Zona de Atenção",
      color: "text-warning",
      bg: "bg-warning-soft",
      image: caminhoAtencao,
      markerPosition: getMarkerPosition(days),
    };
  }

  return {
    key: "critico",
    label: "Zona Crítica",
    color: "text-danger",
    bg: "bg-danger-soft",
    image: caminhoCritico,
    markerPosition: getMarkerPosition(days),
  };
};

const getEmotionalFactors = ({ diasAtuais, indicators }) => {
  if (!indicators) {
    return [
      "Selecione uma empresa para gerar fatores automáticos",
      "Aguardando dados do período selecionado",
      "Análise será atualizada em tempo real",
    ];
  }

  const factors = [];

  if (diasAtuais < 30) {
    factors.push("Runway abaixo de 30 dias");
  } else if (diasAtuais < 60) {
    factors.push("Runway em zona de atenção");
  } else {
    factors.push("Runway dentro da faixa operacional");
  }

  if (indicators.cashOutVariation > 0) {
    factors.push("Despesas cresceram em relação ao mês anterior");
  } else {
    factors.push("Despesas controladas no período");
  }

  if (indicators.cashInVariation < 0) {
    factors.push("Receitas caíram em relação ao mês anterior");
  } else {
    factors.push("Receitas estáveis ou em crescimento");
  }

  if (indicators.monthlyBalance?.resultado_mes < 0) {
    factors.push("Saldo mensal negativo");
  }

  if (indicators.balanceVariation < 0) {
    factors.push("Resultado mensal pior que o mês anterior");
  }

  return factors.slice(0, 3);
};

const Overview = () => {
  const { transactions, loadingTransaction } = useTransactions();
  const { balances } = useBalances();
  const { periodSelected } = usePeriods();
  const { companySelected } = useCompanies();

  const [diasAnimados, setDiasAnimados] = useState(0);

  const indicators = getIndicatorsPeriod({
    transactions,
    balances,
    periodSelected,
    companySelectedId: companySelected?.id,
  });

  const monthlyExpenses = indicators?.monthlyBalance?.total_despesas || 0;
  const cashAvailable = indicators?.cashAvailable || 0;
  const diasAtuais =
    monthlyExpenses > 0
      ? Math.max(0, Math.floor(cashAvailable / (monthlyExpenses / 30)))
      : 0;

  const runwayStatus = getRunwayStatus(diasAtuais);
  const emotionalState = emotionalStates[runwayStatus.key];
  const emotionalFactors = getEmotionalFactors({
    diasAtuais,
    indicators,
  });

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    setDiasAnimados(0);

    if (!companySelected?.id || diasAtuais <= 0) {
      return undefined;
    }

    let start = 0;
    const end = diasAtuais;
    const duration = 1600;
    const incrementTime = Math.max(20, duration / end);

    const counter = setInterval(() => {
      start += 1;
      setDiasAnimados(start);

      if (start >= end) {
        clearInterval(counter);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [diasAtuais, companySelected?.id]);

  const hasCompanySelected = companySelected?.id !== undefined && companySelected?.id !== null;

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="relative flex min-h-[430px] flex-col overflow-hidden rounded-3xl border border-soft bg-card p-6 shadow-sm xl:col-span-7">
          
          <div className="relative z-10">
            <h2 className="text-sm font-bold uppercase text-primary">
              Horizonte de Caixa
            </h2>

            <p className="mt-1 text-xs text-secondary">
              Atualizado em {dataAtual}
            </p>

            <DaysStability companySelectedId = {companySelected?.id || null} diasAnimados = {diasAnimados} runwayStatusColor = {runwayStatus.color} />

            <RunwayBadge 
              hasCompany={companySelected?.id ? true : false}
              label={runwayStatus.label}
              bgColor={runwayStatus.bg}
              textColor={runwayStatus.color}
            />

          </div>

          <RunwayPathImage 
            image={runwayStatus.image}
            alt="Caminho representando o horizonte de caixa"
          />

          <RunwayGoal />

          <RunwayTimeline 
            hasCompany={!!companySelected?.id}
            diasAtuais={diasAtuais}
            markerPosition={runwayStatus.markerPosition}
            label={runwayStatus.label}
            color={runwayStatus.color}
          />

        </div>

        <MetricCards indicators={indicators} loading={loadingTransaction} />

        <EmotionalStateCard
          hasCompanySelected={hasCompanySelected}
          emotionalState={emotionalState}
          emotionalFactors={emotionalFactors}
        />

      </div>
    </section>
  );
};

export default Overview;
