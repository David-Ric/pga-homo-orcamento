import React, { useEffect, useState } from 'react';
import '../../styles/global.scss';
import Navbar from '../../components/Navbar/Navbar';
import LogoOle from '../../assets/ole-logo.png';
import LogoAvatar from '../../assets/avatar1.png';
import Messeger from '../../assets/messege.png';
import ChampGif from '../../assets/playy.gif';
import Footer from '../../components/Footer/Footer';
import { RedirectFunction } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo-dark.png';
import api from '../../services/api';
import Alert from '../../components/Alert';
import SideNavBar from '../../components/Navbar/SideNavBar';
import NavbarDashHeader from '../../components/Navbar/NavbarDashHeader/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { iDadosUsuario } from '../../@types';
import axios from 'axios';
import logoSankhya from '../../assets/logo-dark.png';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FooterMobile from '../../components/Footer/FooterMobile';
import { versaoFront as versaoFrontConst } from '../../data/indexedDB';

type Apontamento = {
  id: number;
  title: string;
};

export default function Configuracoes() {
  const history = useNavigate();
  let [user, setUser] = useState('');
  let [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [alertErro, setAlertErro] = useState(false);
  let [producao, setProducao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMensage, setShowMensage] = useState(false);
  const handleCloseMensage = () => setShowMensage(false);
  const [alertErroMensage, setAlertErroMensage] = useState(false);
  let [tipoApont, settipoApont] = useState('');
  const usuario: iDadosUsuario = JSON.parse(
    localStorage.getItem('@Portal/usuario') || '{}'
  );

  const [showupdate, setShowupdate] = useState(false);
  const [verificarEnvio, setVerificarEnvio] = useState(false);
  const handleCloseupdate = () => setShowupdate(false);
  const [fixo1, setFixo1] = useState(true);
  const [fixo2, setFixo2] = useState(true);
  const [apontamentoSankhya, setApontamentoSankhya] = useState('');
  const [usuarioSankhya, setusuarioSankhya] = useState('');
  const [senhaSankhya, setsenhaSankhya] = useState('');
  const [tempoSessao, setTempoSessao] = useState(0);
  const [sql, setsql] = useState('');
  let [sucess, setSucess] = useState(0);

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File>();
  const [showVersaoModal, setShowVersaoModal] = useState(false);
  const [novaVersao, setNovaVersao] = useState('');
  const [versaoDb, setVersaoDb] = useState('');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = () => {
        const fileContent = reader.result as string;
        const jsonContent = JSON.parse(fileContent);
        setTitle(jsonContent.title);
      };
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    logado();
    GetapontamentoId();
    CarregarVerificarEnvio();
  }, []);

  function logado() {
    if (
      localStorage.getItem('@Portal/superusuario') == 'true' ||
      usuario.username == 'admin'
    ) {
      setLoading(false);
    } else {
      history('/');
    }
  }
  async function AtivarVerificarEnvio() {
    try {
      const existing = await api.get('/api/Etiqueta/1');
      await api.put('/api/Etiqueta/1', {
        id: 1,
        titulo: 'Verificar Envio',
        nomeTxt: 'Verificar Envio',
        sql: 'Verificar Envio',
        zpl: 'Verificar Envio',
        printerAddress: 'Verificar Envio',
      });
      setVerificarEnvio(true);
    } catch {
      try {
        const form = new FormData();
        form.append('Id', '1');
        form.append('Titulo', 'Verificar Envio');
        form.append('NomeTxt', 'Verificar Envio');
        form.append('Sql', 'Verificar Envio');
        form.append('Zpl', 'Verificar Envio');
        form.append('PrinterAddress', 'Verificar Envio');
        const pngBase64 =
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6Xb+QAAAABJRU5ErkJggg==';
        const bytes = Uint8Array.from(atob(pngBase64), (c) =>
          c.charCodeAt(0)
        );
        const blob = new Blob([bytes], { type: 'image/png' });
        form.append(
          'File',
          new File([blob], 'verificar-envio.png', { type: 'image/png' })
        );
        await api.post('/api/Etiqueta', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setVerificarEnvio(true);
      } catch {
        setLoading(false);
      }
    }
  }

  async function DesativarVerificarEnvio() {
    await api
      .delete('/api/Etiqueta/1')
      .then(() => {
        setVerificarEnvio(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  async function CarregarVerificarEnvio() {
    try {
      const resp = await api.get('/api/Etiqueta/1');
      const titulo = String((resp as any)?.data?.titulo ?? '').trim();
      const nomeTxt = String((resp as any)?.data?.nomeTxt ?? '').trim();
      setVerificarEnvio(titulo === 'Verificar Envio' && nomeTxt === 'Verificar Envio');
    } catch {
      setVerificarEnvio(false);
    }
  }

  async function GetapontamentoId() {
    setLoading(true);
    setSucess(20);
    await api

      .get(`/api/Configuracao/1`)
      .then((response) => {
        console.log('apontamento', response.data.sankhyaServidor);
        setApontamentoSankhya(response.data.sankhyaServidor);
        setusuarioSankhya(response.data.sankhyaUsuario);
        setsenhaSankhya(response.data.sankhyaSenha);
        setTempoSessao(response.data.tempoSessao);
        try {
          const vdb =
            response?.data?.versao ??
            response?.data?.Versao ??
            response?.data?.versaoApp ??
            '';
          const v = String(vdb || '');
          setVersaoDb(v);
          setNovaVersao(v);
        } catch {}
        setSucess(80);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
        setLoading(false);
      });
  }

  async function MudarApontamento() {
    await api
      .put(`/api/Configuracao/1`, {
        Id: 1,
        SankhyaServidor: apontamentoSankhya,
        SankhyaUsuario: usuarioSankhya,
        SankhyaSenha: senhaSankhya,
        TempoSessao: tempoSessao,
      })
      .then((response) => {
        console.log('apontamento editado', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Apontamento realizado com sucesso!');
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  async function MudarSessao() {
    await api
      .put(`/api/Configuracao/1`, {
        Id: 1,
        SankhyaServidor: apontamentoSankhya,
        SankhyaUsuario: 'ADMIN',
        SankhyaSenha: 'SYNC550V',
        TempoSessao: tempoSessao,
      })
      .then((response) => {
        console.log('apontamento editado', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Tempo de Sessão alterado com sucesso!');
        localStorage.setItem('@Portal/TempoSessao', String(tempoSessao));
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  async function EnviarSql() {
    await api
      .post(`/api/InjecaoSQL/executar-sql?sql=${sql}`)
      .then((response) => {
        setsql('');
        console.log('slq', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        const data = response?.data;
        const msg =
          typeof data === 'string'
            ? data
            : data?.title || data?.message || 'Comando executado com sucesso';
        setMsgErro(msg);
      })
      .catch((error) => {
        console.log(error.respose);
        setShowMensage(true);
        setAlertErroMensage(true);
        const data = error?.response?.data;
        const msg =
          typeof data === 'string'
            ? data
            : data?.title || data?.message || 'Erro ao executar SQL';
        setMsgErro(msg);
        return;
      });
  }

  async function AtualizarVersao() {
    try {
      const cfgResp = await api.get(`/api/Configuracao/1`);
      const cfgAtual = { ...(cfgResp?.data || {}) };
      cfgAtual.Versao = novaVersao;
      cfgAtual.versao = novaVersao;
      cfgAtual.versaoApp = novaVersao;
      await api.put(`/api/Configuracao/1`, cfgAtual);
      try {
        const tituloUpdate = 'Opa... tem nova atualização do PGA por aqui!';
        const textoUpdate = `Olá, temos uma nova atualização do PGA pra você, entre m contato como comercial e saiba das novidades desta versão ${novaVersao}, Para atualizar clique no aceite`;
        const dataAtual = new Date();
        const resp = await api.get(`/api/GrupoUsuario?pagina=1&totalpagina=999`);
        const gruposAlvo = Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data)
          ? resp.data
          : [];
        if (gruposAlvo && gruposAlvo.length > 0) {
          await Promise.all(
            gruposAlvo.map((g: any) =>
              api.post('/api/ComunicadoComercial', {
                titulo: tituloUpdate,
                texto: textoUpdate,
                grupoId: g.id,
                criadoEm: dataAtual,
              })
            )
          );
        }
      } catch (e) {}
      setShowMensage(true);
      setAlertErroMensage(true);
      setMsgErro('Versão atualizada com sucesso!');
      setShowVersaoModal(false);
    } catch (error: any) {
      setShowMensage(true);
      setAlertErroMensage(true);
      const data = error?.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : data?.title || data?.message || 'Erro ao atualizar a versão';
      setMsgErro(msg);
    }
  }

  async function AtualizarDados() {
    setShowupdate(true);
    setSucess(0);
    sucess = 0;
    Sucess();
    setAlertErroMensage(true);
    setMsgErro('Atualizando dados...');
    await api
      .post('/api/RestaurarMenu')
      .then((response) => {
        window.location.reload();
        setLoading(false);
        console.log(response);
        setShowupdate(true);
        setAlertErroMensage(true);
        setMsgErro('Dados atualizados com sucesso!!!');
      })
      .catch((error) => {
        setLoading(false);
      });
  }
  function Sucess() {
    setTimeout(function () {
      setSucess(20);
      sucess = 20;
      Sucess2();
    }, 1200);
  }
  function Sucess2() {
    setTimeout(function () {
      setSucess(40);
      sucess = 40;
      Sucess3();
    }, 1000);
  }
  function Sucess3() {
    setTimeout(function () {
      setSucess(100);
      sucess = 100;
      Sucess();
    }, 1000);
  }

  async function CreateComunicado() {
    setLoading(true);
    await api
      .post('/api/Comunicado', {
        titulo: 'ATUALIZAÇÃO',
        texto: 'NOVA ATUALIZAÇÃO',
      })

      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response);
        setShowMensage(true);
        setMsgErro('Erro ao criar post.');
        return;
      });
  }

  //==========================================================//
  return (
    <>
      {loading ? (
        <div className="loadingGeral">
          <div className="loadingModal">
            <img id="logoSankhya" src={logoSankhya} alt="" />
            <h1 style={{ marginTop: 15 }}>Carregando dados...</h1>
            <h1 style={{ marginTop: 15 }}></h1>
            <ProgressBar className="progress" animated now={sucess} />
          </div>
        </div>
      ) : (
        <>
          <div className="content-global">
            <div className="conteudo-cotainner">
              <div className="">
                <SideNavBar />
              </div>
              <NavbarDashHeader />
              <div className="titulo-page">
                <h1>Configuraçôes Gerais</h1>
              </div>
              <div className="contain">
                <div className="conteudo">
                  <div className="divApontamento">
                    <div className="div-controles">
                      <div>
                        <h1 className="title-input">Apontamento Sankhya:</h1>
                        <input
                          id="sankhya"
                          value={apontamentoSankhya}
                          type="text"
                          className="form-control select inputparceiro inputApont"
                          onChange={(e) => {
                            setApontamentoSankhya(e.target.value);
                          }}
                        />
                      </div>
                      <div className="d-flex">
                        <div>
                          <h1 className="title-input">Usuario Sankhya:</h1>
                          <input
                            id="sankhya"
                            value={usuarioSankhya}
                            type="text"
                            className="form-control select inputparceiro inputApont"
                            onChange={(e) => {
                              setusuarioSankhya(e.target.value);
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: 20 }}>
                          <h1 className="title-input">Senha Sankhya:</h1>
                          <input
                            id="sankhya"
                            value={senhaSankhya}
                            type="password"
                            className="form-control select inputparceiro inputApont"
                            onChange={(e) => {
                              setsenhaSankhya(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={() => {
                        MudarApontamento();
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Tempo de Sessão Geral:</h1>
                      <div className="d-flex">
                        <input
                          id="sankhya-sessao"
                          value={tempoSessao}
                          type="number"
                          className="form-control select inputparceiro inputApontSessao"
                          onChange={(e) => {
                            setTempoSessao(Number(e.target.value));
                          }}
                        />
                        <h1 className="title-input">Minutos</h1>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={() => {
                        MudarSessao();
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Injeção SQL:</h1>
                      <input
                        id="sistema"
                        value={sql}
                        type="text"
                        className="form-control select inputparceiro inputApont"
                        onChange={(e) => {
                          setsql(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={EnviarSql}
                    >
                      Enviar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Versão do App:</h1>
                      <div className="d-flex" style={{ alignItems: 'center' }}>
                        <input
                          id="versao-front"
                          value={novaVersao}
                          type="text"
                          className="form-control select inputparceiro inputApont"
                          style={{ maxWidth: 200 }}
                          onChange={(e) => setNovaVersao(e.target.value)}
                        />
                        <button
                          style={{ marginLeft: 10 }}
                          className="btn btn-dark"
                          onClick={AtualizarVersao}
                        >
                          Atualizar versão
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Verificar Envio:</h1>
                      <div
                        className="d-flex"
                        style={{ alignItems: 'center', marginTop: 15 }}
                      >
                        <input
                          type="checkbox"
                          checked={verificarEnvio}
                          onChange={async (e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              await AtivarVerificarEnvio();
                            } else {
                              await DesativarVerificarEnvio();
                            }
                          }}
                        />
                        <h1 style={{ marginLeft: 10 }}>
                          {verificarEnvio ? 'Ativo' : 'Inativo'}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ================Modal Cofirmação ============================================== */}

            <Modal
              className="modal-confirm"
              show={showMensage}
              onHide={handleCloseMensage}
            >
              <Modal.Header closeButton>
                <h1>Status da solicitação</h1>
              </Modal.Header>
              <Modal.Body>
                {alertErroMensage && (
                  <div className="mt-3 mb-0  mensagemErropadrao">
                    <Alert msg={msgErro} setAlertErro={setAlertErroMensage} />
                  </div>
                )}
                <button
                  style={{ width: 130 }}
                  className="btn btn-primary"
                  onClick={handleCloseMensage}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>

            {/* =================== modal dados atualizados ================================= */}
            <Modal
              className="modal-confirm"
              show={showupdate}
              onHide={handleCloseupdate}
            >
              <Modal.Header closeButton>
                <h1>Status da solicitação</h1>
              </Modal.Header>
              <Modal.Body>
                {alertErroMensage && (
                  <div className="mt-3 mb-0">
                    <Alert msg={msgErro} setAlertErro={setAlertErroMensage} />
                  </div>
                )}
                <ProgressBar className="progress" animated now={sucess} />
                <button
                  style={{ width: 130, marginTop: 15 }}
                  className="btn btn-primary"
                  onClick={handleCloseupdate}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>
          </div>
            <Modal
              className="modal-confirm"
              show={showVersaoModal}
              onHide={() => setShowVersaoModal(false)}
            >
              <Modal.Header closeButton>
                <h1>Atualizar Versão</h1>
              </Modal.Header>
              <Modal.Body>
                <div className="form-cadastro-user">
                  <div className="bloco-input">
                    <div>
                      <p className="title-input" style={{ textAlign: 'justify' }}>
                        Nova versão:
                      </p>
                      <input
                        className="form-control select inputparceiro"
                        type="text"
                        value={novaVersao}
                        onChange={(e) => setNovaVersao(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bloco-input boco-botoes-grupo" style={{ marginTop: 15 }}>
                    <button className="btn btn-cadastrar" onClick={AtualizarVersao}>
                      Salvar
                    </button>
                    <button
                      className="btn btn-cancelar"
                      onClick={() => setShowVersaoModal(false)}
                      style={{ marginLeft: 10 }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          <FooterMobile />
          <Footer />
        </>
      )}
    </>
  );
}
