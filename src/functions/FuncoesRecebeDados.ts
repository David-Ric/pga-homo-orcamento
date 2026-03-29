import { iDadosUsuario } from "../@types";
import api from "../services/api";
import {atualizarRelatorios} from '../provider/PortalContext'
import Observer from './observer';

//=============== Função Recebe dados ==========================================
export async function receberDadosSankhya() {
    
    await api
      .post(`/api/Sankhya/login`)
      .then((response) => {
        console.log("login sankhya", response);
        //MetaXRealizado()

      })
      .catch((error) => {
        console.log("erro", error);
      });
  }
