import avatarEstavel from "../assets/imagens/avatar-estavel.png";
import avatarAtencao from "../assets/imagens/avatar-atencao.png";
import avatarSobPressao from "../assets/imagens/avatar-sobpressao.png";
import avatarCritico from "../assets/imagens/avatar-critico.png";

import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { MdTrendingFlat } from "react-icons/md";

import {
  FaFaceSmile,
  FaFaceMeh,
  FaFaceFrown,
  FaFaceTired,
} from "react-icons/fa6";

export const emotionalStates = {
  estavel: {
    title: "Estável",
    description: "Sua empresa está operando de forma equilibrada.",
    trend: "Melhorando",
    trendIcon: IoTrendingUp,
    color: "text-success",
    avatar: avatarEstavel,
    gaugeValue: 88,
    emoji: FaFaceSmile,
  },

  atencao: {
    title: "Em Atenção",
    description: "Alguns indicadores começaram a oscilar.",
    trend: "Monitorando",
    trendIcon: MdTrendingFlat,
    color: "text-warning",
    avatar: avatarAtencao,
    gaugeValue: 68,
    emoji: FaFaceMeh,
  },

  sobpressao: {
    title: "Sob Pressão",
    description: "Sua empresa está reagindo mais do que planejando.",
    trend: "Piorando",
    trendIcon: IoTrendingDown,
    color: "text-medium",
    avatar: avatarSobPressao,
    gaugeValue: 42,
    emoji: FaFaceFrown,
  },

  critico: {
    title: "Crítico",
    description: "A estabilidade financeira está em risco.",
    trend: "Crítico",
    trendIcon: IoTrendingDown,
    color: "text-danger",
    avatar: avatarCritico,
    gaugeValue: 12,
    emoji: FaFaceTired,
  },
};