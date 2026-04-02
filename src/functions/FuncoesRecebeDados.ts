import { iDadosUsuario } from "../@types";
import api from "../services/api";
import {atualizarRelatorios} from '../provider/PortalContext'
import Observer from './observer';

//=============== Função Recebe dados ==========================================
export async function receberDadosSankhya() {
    const sql = 'SELECT 1';
    await api
      .post(`/api/Sankhya/DadosDashSankhya?sql=${encodeURIComponent(sql)}`)
      .then((response) => {
        console.log("login sankhya", response);
      })
      .catch((error) => {
        console.log("erro", error);
      });
  }
