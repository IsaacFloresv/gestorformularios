import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, endOfDay } from "date-fns";
import * as XLSX from "xlsx";
import "./dashboard.css";
import Select from "react-select";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRef } from 'react';

const cookies = new Cookies();
const meicimg = "logo_meic.jpg";
const URI = "https://fwmback-production.up.railway.app/asepress";

function Dashboard() {
  const [agente, setAgente] = useState(cookies.get("info"));

  const CerrarSession = () => {
    const respuesta = confirm("¿Desea salir?");
    if (respuesta == true) {
      cookies.remove("info");
      cookies.remove("token");
    }
  };
  // Estados para almacenar los valores de los filtros
  const [filtroNReport, setFiltroNReport] = useState("");
  //const [filtroAgent, setFiltroAgent] = useState("");
  const [agentOptions, setAgentOptions] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [filtroFchCreado, setFiltroFchCreado] = useState("");
  //const [filtroStatus, setFiltroStatus] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  //const [filtroOrigen, setFiltroOrigen] = useState("");
  const [origenOptions, setOrigenOptions] = useState([]);
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [filtroUsuario_s, setFiltroUsuario_s] = useState("");
  const [filtroUs_obser, setFiltroUs_obser] = useState("");
  //const [filtroTdia, setFiltroTdia] = useState("");
  const [tdiaOptions, setTdiaOptions] = useState([]);
  const [selectedTdia, setSelectedTdia] = useState([]);
  const [filtroNdia, setFiltroNdia] = useState("");
  const [filtroNomba, setFiltroNomba] = useState("");
  const [filtroApell1a, setFiltroApell1a] = useState("");
  const [filtroApell2a, setFiltroApell2a] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroEmail2, setFiltroEmail2] = useState("");
  const [filtroTel, setFiltroTel] = useState("");
  const [filtroTel2, setFiltroTel2] = useState("");
  //const [filtroProvi, setFiltroProvi] = useState("");
  const [proviOptions, setProviOptions] = useState([]);
  const [selectedProvi, setSelectedProvi] = useState([]);
  //const [filtroCanto, setFiltroCanto] = useState("");
  const [cantoOptions, setCantoOptions] = useState([]);
  const [selectedCanto, setSelectedCanto] = useState([]);
  //const [filtroDistr, setFiltroDistr] = useState("");
  const [distrOptions, setDistrOptions] = useState([]);
  const [selectedDistr, setSelectedDistr] = useState([]);
  //const [filtroMateria, setFiltroMateria] = useState("");
  const [materiaOptions, setMateriaOptions] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState([]);
  //const [filtroAsunto, setFiltroAsunto] = useState("");
  const [asuntoOptions, setAsuntoOptions] = useState([]);
  const [selectedAsunto, setSelectedAsunto] = useState([]);
  //const [filtroBien, setFiltroBien] = useState("");
  const [bienOptions, setBienOptions] = useState([]);
  const [selectedBien, setSelectedBien] = useState([]);
  //const [filtroTdic, setFiltroTdic] = useState("");
  const [tdicOptions, setTdicOptions] = useState([]);
  const [selectedTdic, setSelectedTdic] = useState([]);
  const [filtroNdic, setFiltroNdic] = useState("");
  const [filtroRsocial, setFiltroRsocial] = useState("");
  const [filtroFantasia, setFiltroFantasia] = useState("");
  const [filtroDesch, setFiltroDesch] = useState("");
  const [filtroRespe, setFiltroRespe] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  //Estados del paginado
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPaginas, setNumPaginas] = useState(0);
  const itemsPerPage = 50;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const maxPagesToShow = 10; // Número máximo de páginas a mostrar a la vez
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(numPaginas, startPage + maxPagesToShow - 1);
  const [rowsCount, setRowsCount] = useState(0);

  //Estados para borrar filtros
  const filtroNReportRef = useRef();
  const filtroFchCreadoRef = useRef();
  const filtroUsuario_sRef = useRef();
  const filtroUs_obserRef = useRef();
  const filtroNdiaRef = useRef();
  const filtroNombaRef = useRef();
  const filtroApell1aRef = useRef();
  const filtroApell2aRef = useRef();
  const filtroEmailRef = useRef();
  const filtroEmail2Ref = useRef();
  const filtroTelRef = useRef();
  const filtroTel2Ref = useRef();
  const filtroNdicRef = useRef();
  const filtroRsocialRef = useRef();
  const filtroFantasiaRef = useRef();
  const filtroDeschRef = useRef();
  const filtroRespeRef = useRef();

  //Estados carga inicial de reportes
  const [isMounted, setIsMounted] = useState(false);
  const [dreportes, setDReportes] = useState([]);
  const [freportes, setFReportes] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [allreportes, setAllReportes] = useState([]);

  //Funcion principal
  const getReportes = async () => {
    const res = await axios.get(URI);
    const report = res.data;
    const numPaginas = Math.ceil(report.length / itemsPerPage);
    setNumPaginas(numPaginas);
    setReportes(report.slice(startIndex, endIndex));
    setDReportes(report);
    setFReportes(report);
    setAllReportes(report);
    setRowsCount(report.length);
    obtencionFiltroAgente(report);
    obtencionFiltroStatus(report);
    obtencionFiltroOrigen(report);
    obtencionFiltroTdia(report);
    obtencionFiltroProvi(report);
    obtencionFiltroCanto(report);
    obtencionFiltroDistr(report);
    obtencionFiltroMateria(report);
    obtencionFiltroAsunto(report);
    obtencionFiltroBien(report);
    obtencionFiltroTdic(report);
  };

  //Funciones actualizadores de select
  const obtencionFiltroAgente = (report, selectedOption) => {
    const agentOptions = [
      ...new Set(report.map((reporte) => reporte.id_agente)),
    ]
      .map((agente) => ({
        value: agente,
        label: agente,
      }))
      .filter((agente) => agente.label !== null);
  
    agentOptions.sort((a, b) => (a.label || '').localeCompare(b.label || ''));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      ...agentOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10') {
      const topAgents = getTopAgents(report, selectedOption); // Obtener los principales agentes según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topAgents.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setAgentOptions(optionsWithTop);
  };
  
  
  const getTopAgents = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
    };
    
    const agentCount = report.reduce((acc, curr) => {
      acc[curr.id_agente] = (acc[curr.id_agente] || 0) + 1;
      return acc;
    }, {});
  
    const topAgents = Object.keys(agentCount).sort((a, b) => agentCount[b] - agentCount[a]).slice(0, topCount[selectedOption]);
  
    return topAgents;
  };
  

  const obtencionFiltroStatus = (report) => {
    // Obtén la lista de status únicos desde tus datos
    const statusOptions = [
      ...new Set(report.map((reporte) => reporte.status)),
    ].map((status) => ({
      value: status,
      label: status,
    }));
    // Ordena la lista de status en orden alfabético
    statusOptions.sort((a, b) => a.label.localeCompare(b.label));

    setStatusOptions(statusOptions);
  };

  const obtencionFiltroOrigen = (report) => {
    // Obtén la lista de status únicos desde tus datos
    const origenOptions = [
      ...new Set(report.map((reporte) => reporte.origen_r)),
    ].map((origen) => ({
      value: origen,
      label: origen,
    }));
    // Ordena la lista de status en orden alfabético
    origenOptions.sort((a, b) => a.label.localeCompare(b.label));

    setOrigenOptions(origenOptions);
  };

  const obtencionFiltroTdia = (report) => {
    // Obtén la lista de status únicos desde tus datos
    const tdiaOptions = [
      ...new Set(report.map((reporte) => reporte.tdia)),
    ].map((tdia) => ({
      value: tdia,
      label: tdia,
    }));
    // Ordena la lista de status en orden alfabético
    tdiaOptions.sort((a, b) => a.label.localeCompare(b.label));

    setTdiaOptions(tdiaOptions);
  };

  const obtencionFiltroProvi = (report, selectedOption) => {
    // Obtén la lista de provincias únicas desde tus datos
    const proviOptions = [
      ...new Set(report.map((reporte) => reporte.provi)),
    ].map((provi) => ({
      value: provi,
      label: provi,
    }));
    // Ordena la lista de provincias en orden alfabético
    proviOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      ...proviOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15') {
      const topProvi = getTopProvi(report, selectedOption); // Obtener las principales provincias según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topProvi.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setProviOptions(optionsWithTop);
  };
  
  const getTopProvi = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
    };
    
    const proviCount = report.reduce((acc, curr) => {
      acc[curr.provi] = (acc[curr.provi] || 0) + 1;
      return acc;
    }, {});
  
    const topProvi = Object.keys(proviCount).sort((a, b) => proviCount[b] - proviCount[a]).slice(0, topCount[selectedOption]);
  
    return topProvi;
  };
  

  const obtencionFiltroCanto = (report, selectedOption) => {
    // Obtén la lista de cantidades únicas desde tus datos
    const cantoOptions = [
      ...new Set(report.map((reporte) => reporte.canto)),
    ].map((canto) => ({
      value: canto,
      label: canto,
    }));
    // Ordena la lista de cantidades en orden alfabético
    cantoOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      { value: 'top20', label: 'Top 20' },
      ...cantoOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15' || selectedOption === 'top20') {
      const topCanto = getTopCanto(report, selectedOption); // Obtener las principales cantidades según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topCanto.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setCantoOptions(optionsWithTop);
  };
  
  const getTopCanto = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
      'top20': 20,
    };
    
    const cantoCount = report.reduce((acc, curr) => {
      acc[curr.canto] = (acc[curr.canto] || 0) + 1;
      return acc;
    }, {});
  
    const topCanto = Object.keys(cantoCount).sort((a, b) => cantoCount[b] - cantoCount[a]).slice(0, topCount[selectedOption]);
  
    return topCanto;
  };

  const obtencionFiltroDistr = (report, selectedOption) => {
    // Obtén la lista de distritos únicos desde tus datos
    const distrOptions = [
      ...new Set(report.map((reporte) => reporte.distr)),
    ].map((distr) => ({
      value: distr,
      label: distr,
    }));
    // Ordena la lista de distritos en orden alfabético
    distrOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      { value: 'top20', label: 'Top 20' },
      ...distrOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15' || selectedOption === 'top20') {
      const topDistr = getTopDistr(report, selectedOption); // Obtener los principales distritos según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topDistr.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setDistrOptions(optionsWithTop);
  };
  
  const getTopDistr = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
      'top20': 20,
    };
    
    const distrCount = report.reduce((acc, curr) => {
      acc[curr.distr] = (acc[curr.distr] || 0) + 1;
      return acc;
    }, {});
  
    const topDistr = Object.keys(distrCount).sort((a, b) => distrCount[b] - distrCount[a]).slice(0, topCount[selectedOption]);
  
    return topDistr;
  };

  const obtencionFiltroMateria = (report, selectedOption) => {
    // Obtén la lista de materias únicas desde tus datos
    const materiaOptions = [
      ...new Set(report.map((reporte) => reporte.materia)),
    ].map((materia) => ({
      value: materia,
      label: materia,
    }));
    // Ordena la lista de materias en orden alfabético
    materiaOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      ...materiaOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15') {
      const topMateria = getTopMateria(report, selectedOption); // Obtener las principales materias según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topMateria.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setMateriaOptions(optionsWithTop);
  };
  
  const getTopMateria = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
    };
    
    const materiaCount = report.reduce((acc, curr) => {
      acc[curr.materia] = (acc[curr.materia] || 0) + 1;
      return acc;
    }, {});
  
    const topMateria = Object.keys(materiaCount).sort((a, b) => materiaCount[b] - materiaCount[a]).slice(0, topCount[selectedOption]);
  
    return topMateria;
  };

  const obtencionFiltroAsunto = (report, selectedOption) => {
    // Obtén la lista de asuntos únicos desde tus datos
    const asuntoOptions = [
      ...new Set(report.map((reporte) => reporte.asunto)),
    ].map((asunto) => ({
      value: asunto,
      label: asunto,
    }));
    // Ordena la lista de asuntos en orden alfabético
    asuntoOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      { value: 'top20', label: 'Top 20' },
      ...asuntoOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15' || selectedOption === 'top20') {
      const topAsunto = getTopAsunto(report, selectedOption); // Obtener los principales asuntos según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topAsunto.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setAsuntoOptions(optionsWithTop);
  };
  
  const getTopAsunto = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
      'top20': 20,
    };
    
    const asuntoCount = report.reduce((acc, curr) => {
      acc[curr.asunto] = (acc[curr.asunto] || 0) + 1;
      return acc;
    }, {});
  
    const topAsunto = Object.keys(asuntoCount).sort((a, b) => asuntoCount[b] - asuntoCount[a]).slice(0, topCount[selectedOption]);
  
    return topAsunto;
  };

  const obtencionFiltroBien = (report, selectedOption) => {
    // Obtén la lista de bienes únicos desde tus datos
    const bienOptions = [
      ...new Set(report.map((reporte) => reporte.bien)),
    ].map((bien) => ({
      value: bien,
      label: bien,
    }));
    // Ordena la lista de bienes en orden alfabético
    bienOptions.sort((a, b) => a.label.localeCompare(b.label));
  
    let optionsWithTop = [
      { value: 'top3', label: 'Top 3' },
      { value: 'top5', label: 'Top 5' },
      { value: 'top7', label: 'Top 7' },
      { value: 'top10', label: 'Top 10' },
      { value: 'top15', label: 'Top 15' },
      { value: 'top20', label: 'Top 20' },
      ...bienOptions,
    ];
  
    if (selectedOption === 'top3' || selectedOption === 'top5' || selectedOption === 'top7' || selectedOption === 'top10' || selectedOption === 'top15' || selectedOption === 'top20') {
      const topBien = getTopBien(report, selectedOption); // Obtener los principales bienes según la opción seleccionada
      optionsWithTop = optionsWithTop.filter((option) => {
        return option.value === selectedOption || topBien.includes(option.value);
      });
    }
  
    // Moving selected top option to the end
    const selectedOptionIndex = optionsWithTop.findIndex(option => option.value === selectedOption);
    if (selectedOptionIndex !== -1) {
      const selectedOptionItem = optionsWithTop.splice(selectedOptionIndex, 1);
      optionsWithTop = [...optionsWithTop, ...selectedOptionItem];
    }
  
    setBienOptions(optionsWithTop);
  };
  
  const getTopBien = (report, selectedOption) => {
    const topCount = {
      'top3': 3,
      'top5': 5,
      'top7': 7,
      'top10': 10,
      'top15': 15,
      'top20': 20,
    };
    
    const bienCount = report.reduce((acc, curr) => {
      acc[curr.bien] = (acc[curr.bien] || 0) + 1;
      return acc;
    }, {});
  
    const topBien = Object.keys(bienCount).sort((a, b) => bienCount[b] - bienCount[a]).slice(0, topCount[selectedOption]);
  
    return topBien;
  };

  const obtencionFiltroTdic = (report) => {
    // Obtén la lista de status únicos desde tus datos
    const tdicOptions = [
      ...new Set(report.map((reporte) => reporte.tdic)),
    ].map((tdic) => ({
      value: tdic,
      label: tdic,
    }));
    // Ordena la lista de status en orden alfabético
    tdicOptions.sort((a, b) => a.label.localeCompare(b.label));

    setTdicOptions(tdicOptions);
  };

  // Función de búsqueda que combina los filtros
  const buscarReportes = () => {
    // Obtener los datos de la base de datos
    const filt = dreportes.filter((reporte) => {
      const [fechaPart, horaPart] = reporte.fchareg.split(", ");

      // Separar la cadena de fecha en día, mes y año
      const [fecha, hora] = fechaPart.split(" ");
      const [dia, mes, ano] = fecha.split("/");

      if (horaPart) {
        // Dividir la hora en horas, minutos y segundos
        const [horas, minutos, segundos] = horaPart.split(":");

        // Crear un objeto Date con los valores extraídos
        const reportDate = new Date(
          ano,
          mes - 1,
          dia,
          horas,
          minutos,
          segundos
        );

        const nreporte = filtroNReport.split(',').map((nreport) => nreport.trim().toString());
        const numdias = filtroNdia.split(',').map((numdia) => numdia.trim().toLowerCase());
        const nombres = filtroNomba.split(',').map((nombre) => nombre.trim().toLowerCase());
        const apellidos1 = filtroApell1a.split(',').map((apellido1) => apellido1.trim().toLowerCase());
        const apellidos2 = filtroApell2a.split(',').map((apellido2) => apellido2.trim().toLowerCase());
        const correos1 = filtroEmail.split(',').map((correo1) => correo1.trim().toLowerCase());
        const correos2 = filtroEmail2.split(',').map((correo2) => correo2.trim().toLowerCase());
        const teles1 = filtroTel.split(',').map((tele1) => tele1.trim().toLowerCase());
        const teles2 = filtroTel2.split(',').map((tele2) => tele2.trim().toLowerCase());
        const numdics = filtroNdic.split(',').map((numdic) => numdic.trim().toLowerCase());
        const razsociales = filtroRsocial.split(',').map((razsocial) => razsocial.trim().toLowerCase());
        const nomfantasia = filtroFantasia.split(',').map((fantasia) => fantasia.trim().toLowerCase());
        const descrips = filtroDesch.split(',').map((descrip) => descrip.trim().toLowerCase());
        const resps = filtroRespe.split(',').map((resp) => resp.trim().toLowerCase());

        const selectedAgentValues = selectedAgents.map((agent) => agent.value);
        const agentMatches = selectedAgentValues.includes(reporte.id_agente);
        const selectedStatusValues = selectedStatus.map((status) => status.value);
        const statusMatches = selectedStatusValues.includes(reporte.status);
        const selectedOrigenValues = selectedOrigen.map((origen) => origen.value);
        const origenMatches = selectedOrigenValues.includes(reporte.origen_r);
        const selectedTdiaValues = selectedTdia.map((tdia) => tdia.value);
        const tdiaMatches = selectedTdiaValues.includes(reporte.tdia);
        const selectedProviValues = selectedProvi.map((provi) => provi.value);
        const proviMatches = selectedProviValues.includes(reporte.provi);
        const selectedCantoValues = selectedCanto.map((canto) => canto.value);
        const cantoMatches = selectedCantoValues.includes(reporte.canto);
        const selectedDistrValues = selectedDistr.map((distr) => distr.value);
        const distrMatches = selectedDistrValues.includes(reporte.distr);
        const selectedMateriaValues = selectedMateria.map((materia) => materia.value);
        const materiaMatches = selectedMateriaValues.includes(reporte.materia);
        const selectedAsuntoValues = selectedAsunto.map((asunto) => asunto.value);
        const asuntoMatches = selectedAsuntoValues.includes(reporte.asunto);
        const selectedBienValues = selectedBien.map((bien) => bien.value);
        const bienMatches = selectedBienValues.includes(reporte.bien);
        const selectedTdicValues = selectedTdic.map((tdic) => tdic.value);
        const tdicMatches = selectedTdicValues.includes(reporte.tdic);

        return (
          nreporte.some((nreport) => reporte.id_report?.toString().includes(nreport)) &&
          (selectedAgentValues.length === 0 || agentMatches) &&
          reporte.fchareg.includes(filtroFchCreado) &&
          (selectedStatusValues.length === 0 || statusMatches) &&
          (selectedOrigenValues.length === 0 || origenMatches) &&
          reporte.usuario_s
            ?.toLowerCase()
            .includes(filtroUsuario_s.toLowerCase()) &&
          reporte.us_obser
            ?.toLowerCase()
            .includes(filtroUs_obser.toLowerCase()) &&
          (selectedTdiaValues.length === 0 || tdiaMatches) &&
          numdias.some((numdia) => reporte.ndia?.toLowerCase().includes(numdia)) &&
          nombres.some((nombre) => reporte.nomba?.toLowerCase().includes(nombre)) &&
          apellidos1.some((apellido1) => reporte.apell1a?.toLowerCase().includes(apellido1)) &&
          apellidos2.some((apellido2) => reporte.apell2a?.toLowerCase().includes(apellido2)) &&
          correos1.some((correo1) => reporte.email?.toLowerCase().includes(correo1)) &&
          correos2.some((correo2) => reporte.email2?.toLowerCase().includes(correo2)) &&
          teles1.some((tele1) => reporte.tel?.toLowerCase().includes(tele1)) &&
          teles2.some((tele2) => reporte.tel2?.toLowerCase().includes(tele2)) &&
          (selectedProviValues.length === 0 || proviMatches) &&
          (selectedCantoValues.length === 0 || cantoMatches) &&
          (selectedDistrValues.length === 0 || distrMatches) &&
          (selectedMateriaValues.length === 0 || materiaMatches) &&
          (selectedAsuntoValues.length === 0 || asuntoMatches) &&
          (selectedBienValues.length === 0 || bienMatches) &&
          (selectedTdicValues.length === 0 || tdicMatches) &&
          numdics.some((numdic) => reporte.ndic?.toLowerCase().includes(numdic)) &&
          razsociales.some((razsocial) => reporte.razon_social?.toLowerCase().includes(razsocial)) &&
          nomfantasia.some((fantasia) => reporte.nombre_fantasia?.toLowerCase().includes(fantasia)) &&
          descrips.some((descrip) => reporte.desch?.toLowerCase().includes(descrip)) &&
          resps.some((resp) => reporte.respe?.toLowerCase().includes(resp)) &&
          (!startDateFilter ||
            reportDate >= startOfDay(new Date(startDateFilter))) &&
          (!endDateFilter || reportDate <= endOfDay(new Date(endDateFilter)))
        );
      }
    });

    // Pasar los filtros a la función
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setReportes(filt.slice(startIndex, endIndex));
    setAllReportes(filt);
    const numPaginas = Math.ceil(filt.length / itemsPerPage);
    setNumPaginas(numPaginas);
    console.log(numPaginas);
    setRowsCount(filt.length);
  };

  // Manejadores de eventos para los cambios en los inputs de los filtros

  const handleFiltroNReport = (e) => {
    setFiltroNReport(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAgent = (selectedOptions) => {
    setSelectedAgents(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10','top15'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedAgents = selectedValues.filter((value) => !topOptions.includes(value));
      selectedAgents.push(topOption); // Agregar la opción Top a los agentes seleccionados
      const topAgents = getTopAgents(allreportes, topOption);
      const topAgentOptions = agentOptions.filter((option) => topAgents.includes(option.value));
      setSelectedAgents([...selectedOptions, ...topAgentOptions]);
    }
  
    setCurrentPage(1);
  };  

  const handleFiltroFchCreado = (e) => {
    setFiltroFchCreado(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectStatus = (selectedOptions) => {
    setSelectedStatus(selectedOptions);
    setCurrentPage(1);
  };

  const handleSelectOrigen = (selectedOptions) => {
    setSelectedOrigen(selectedOptions);
    setCurrentPage(1);
  };

  const handleFiltroUsuario_s = (e) => {
    setFiltroUsuario_s(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroUs_obser = (e) => {
    setFiltroUs_obser(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectTdia = (selectedOptions) => {
    setSelectedTdia(selectedOptions);
    setCurrentPage(1);
  };

  const handleFiltroNdia = (e) => {
    setFiltroNdia(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroNomba = (e) => {
    setFiltroNomba(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroApell1a = (e) => {
    setFiltroApell1a(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroApell2a = (e) => {
    setFiltroApell2a(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroEmail = (e) => {
    setFiltroEmail(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroEmail2 = (e) => {
    setFiltroEmail2(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroTel = (e) => {
    setFiltroTel(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroTel2 = (e) => {
    setFiltroTel2(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectProvi = (selectedOptions) => {
    setSelectedProvi(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedProv = selectedValues.filter((value) => !topOptions.includes(value));
      selectedProv.push(topOption); // Agregar la opción Top a las provincias seleccionadas
      const topProvi = getTopProvi(allreportes, topOption); // Obtener las principales provincias según la opción seleccionada
      const topProviOptions = proviOptions.filter((option) => topProvi.includes(option.value));
      setSelectedProvi([...selectedOptions, ...topProviOptions]);
    }
  
    setCurrentPage(1);
  };
  
  const handleSelectCanto = (selectedOptions) => {
    setSelectedCanto(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedCanto = selectedValues.filter((value) => !topOptions.includes(value));
      selectedCanto.push(topOption); // Agregar la opción Top a las cantidades seleccionadas
      const topCanto = getTopCanto(allreportes, topOption); // Obtener las principales cantidades según la opción seleccionada
      const topCantoOptions = cantoOptions.filter((option) => topCanto.includes(option.value));
      setSelectedCanto([...selectedOptions, ...topCantoOptions]);
    }
  
    setCurrentPage(1);
  };

  const handleSelectDistr = (selectedOptions) => {
    setSelectedDistr(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedDistr = selectedValues.filter((value) => !topOptions.includes(value));
      selectedDistr.push(topOption); // Agregar la opción Top a los distritos seleccionados
      const topDistr = getTopDistr(allreportes, topOption); // Obtener los principales distritos según la opción seleccionada
      const topDistrOptions = distrOptions.filter((option) => topDistr.includes(option.value));
      setSelectedDistr([...selectedOptions, ...topDistrOptions]);
    }
  
    setCurrentPage(1);
  };

  const handleSelectMateria = (selectedOptions) => {
    setSelectedMateria(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10', 'top15'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedMateria = selectedValues.filter((value) => !topOptions.includes(value));
      selectedMateria.push(topOption); // Agregar la opción Top a las materias seleccionadas
      const topMateria = getTopMateria(allreportes, topOption); // Obtener los principales materia según la opción seleccionada
      const topMateriaOptions = materiaOptions.filter((option) => topMateria.includes(option.value));
      setSelectedMateria([...selectedOptions, ...topMateriaOptions]);
    }
  
    setCurrentPage(1);
  };

  const handleSelectAsunto = (selectedOptions) => {
    setSelectedAsunto(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedAsunto = selectedValues.filter((value) => !topOptions.includes(value));
      selectedAsunto.push(topOption); // Agregar la opción Top a los asuntos seleccionados
      const topAsunto = getTopAsunto(allreportes, topOption); // Obtener los principales asuntos según la opción seleccionada
      const topAsuntoOptions = asuntoOptions.filter((option) => topAsunto.includes(option.value));
      setSelectedAsunto([...selectedOptions, ...topAsuntoOptions]);
    }
  
    setCurrentPage(1);
  };
  
  const handleSelectBien = (selectedOptions) => {
    setSelectedBien(selectedOptions);
  
    const selectedValues = selectedOptions.map((option) => option.value);
    const topOptions = ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'];
  
    if (selectedValues.some((value) => topOptions.includes(value))) {
      const topOption = selectedValues.find((value) => topOptions.includes(value));
      const selectedBien = selectedValues.filter((value) => !topOptions.includes(value));
      selectedBien.push(topOption); // Agregar la opción Top a los bienes seleccionados
      const topBien = getTopBien(allreportes, topOption); // Obtener los principales bienes según la opción seleccionada
      const topBienOptions = bienOptions.filter((option) => topBien.includes(option.value));
      setSelectedBien([...selectedOptions, ...topBienOptions]);
    }
  
    setCurrentPage(1);
  };  

  const handleSelectTdic = (selectedOptions) => {
    setSelectedTdic(selectedOptions);
    setCurrentPage(1);
  };

  const handleFiltroNdic = (e) => {
    setFiltroNdic(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroRsocial = (e) => {
    setFiltroRsocial(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroFantasia = (e) => {
    setFiltroFantasia(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroDesch = (e) => {
    setFiltroDesch(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroRespe = (e) => {
    setFiltroRespe(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (date) => {
    setStartDateFilter(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date) => {
    setEndDateFilter(date);
    setCurrentPage(1);
  };

  const handleBorrarFiltrosClick = () => {
    buscarReportes();
    const numPaginas = Math.ceil(dreportes.length / itemsPerPage);
    setNumPaginas(numPaginas);
    console.log(numPaginas);
    setStartDateFilter(null);
    setEndDateFilter(null);
    console.log("adios");
  };

  //Funcion de exportar a excel
  const exportarTodosLosDatos = () => {
    // Copia profunda de los datos originales para evitar modificaciones no deseadas
    const datosExportar = JSON.parse(JSON.stringify(allreportes));

    // Renombrar las columnas
    datosExportar.forEach((reporte) => {
      reporte["# Reporte"] = reporte.id_report;
      reporte["Agente"] = reporte.id_agente;
      reporte["Fch. Creado"] = reporte.fchareg;
      reporte["Estado"] = reporte.status;
      reporte["Origen"] = reporte.origen_r;
      reporte["Usuario Especial"] = reporte.usuario_s;
      reporte["Observación"] = reporte.us_obser;
      reporte["Tipo Ident."] = reporte.tdia;
      reporte["N. Ident."] = reporte.ndia;
      reporte["Nombre Cliente"] = reporte.nomba;
      reporte["1er Apell Cliente"] = reporte.apell1a;
      reporte["2do Apell Cliente"] = reporte.apell2a;
      reporte["Correo 1"] = reporte.email;
      reporte["Correo 2"] = reporte.email2;
      reporte["Telefono 1"] = reporte.tel;
      reporte["Telefono 2"] = reporte.tel2;
      reporte["Provincia"] = reporte.provi;
      reporte["Canton"] = reporte.canto;
      reporte["Distrito"] = reporte.distr;
      reporte["Materia"] = reporte.materia;
      reporte["Asunto Consult."] = reporte.asunto;
      reporte["Bien"] = reporte.bien;
      reporte["Tipo Ident. Comerciante"] = reporte.tdic;
      reporte["N. Ident. Comerciante"] = reporte.ndic;
      reporte["Razon Social/Nombre Comerciante"] = reporte.razon_social;
      reporte["Nombre Fantasía"] = reporte.nombre_fantasia;
      reporte["Descripción del caso"] = reporte.desch;
      reporte["Respuesta Enviada"] = reporte.respe;
      reporte["ID Audio"] = reporte.id_audio;

      // Eliminacion de las columnas originales
      delete reporte.id_report;
      delete reporte.id_agente;
      delete reporte.fchareg;
      delete reporte.status;
      delete reporte.origen_r;
      delete reporte.usuario_s;
      delete reporte.us_obser;
      delete reporte.tdia;
      delete reporte.ndia;
      delete reporte.nomba;
      delete reporte.apell1a;
      delete reporte.apell2a;
      delete reporte.email;
      delete reporte.email2;
      delete reporte.tel;
      delete reporte.tel2;
      delete reporte.provi;
      delete reporte.canto;
      delete reporte.distr;
      delete reporte.materia;
      delete reporte.asunto;
      delete reporte.bien;
      delete reporte.tdic;
      delete reporte.ndic;
      delete reporte.razon_social;
      delete reporte.nombre_fantasia;
      delete reporte.desch;
      delete reporte.respe;
      delete reporte.id;
      delete reporte.fchacomplet;
      delete reporte.tel_origen;
      delete reporte.fchahech;
      delete reporte.fchagar;
      delete reporte.id_audio;
      delete reporte.id_correo;

    });
    
    const selectedValues = selectedAgents.map((option) => option.value);
    const selectedValuesProvi = selectedProvi.map((option) => option.value);
    const selectedValuesCanto = selectedCanto.map((option) => option.value);
    const selectedValuesDistr = selectedDistr.map((option) => option.value);
    const selectedValuesMateria = selectedMateria.map((option) => option.value);
    const selectedValuesAsunto = selectedAsunto.map((option) => option.value);
    const selectedValuesBien = selectedBien.map((option) => option.value);

    console.log('Selected Values:', selectedValues);
  
    if (
      selectedValues.includes('top3') ||
      selectedValues.includes('top5') ||
      selectedValues.includes('top7') ||
      selectedValues.includes('top10') ||
      selectedValues.includes('top15')
    ) {
      console.log('Enters top condition');
      
      const selectedOption = selectedValues.find((option) =>
        ['top3', 'top5', 'top7', 'top10', 'top15'].includes(option)
      );
  
      console.log('Selected Option:', selectedOption);
  
      const topAgents = getTopAgents(allreportes, selectedOption);
      const topAgentOptions = agentOptions.filter((option) =>
        topAgents.includes(option.value)
      );
      setSelectedAgents(topAgentOptions);
  
      const conteoAgentes = obtenerConteoAgentes(datosExportar);
      const conteoAgentesSheet = XLSX.utils.json_to_sheet(conteoAgentes);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoAgentesSheet, 'ConteoAgentes');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    } else if(
      selectedValuesProvi.includes('top3') ||
      selectedValuesProvi.includes('top5') ||
      selectedValuesProvi.includes('top7') ||
      selectedValuesProvi.includes('top10')
    ){
      const selectedOptionProvi = selectedValuesProvi.find((option) =>
        ['top3', 'top5', 'top7', 'top10'].includes(option)
      );

      const topProvi = getTopProvi(allreportes, selectedOptionProvi);
      const topProviOptions = proviOptions.filter((option) =>
        topProvi.includes(option.value)
      );
      setSelectedProvi(topProviOptions);
  
      const conteoProvincias = obtenerConteoProvincia(datosExportar);
      const conteoProvinciasSheet = XLSX.utils.json_to_sheet(conteoProvincias);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoProvinciasSheet, 'ConteoProvincias');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
    else if(
      selectedValuesCanto.includes('top3') ||
      selectedValuesCanto.includes('top5') ||
      selectedValuesCanto.includes('top7') ||
      selectedValuesCanto.includes('top10')
    ){
      const selectedOptionCanto = selectedValuesCanto.find((option) =>
        ['top3', 'top5', 'top7', 'top10'].includes(option)
      );

      const topCanto = getTopCanto(allreportes, selectedOptionCanto);
      const topCantoOptions = cantoOptions.filter((option) =>
        topCanto.includes(option.value)
      );
      setSelectedCanto(topCantoOptions);
  
      const conteoCantones = obtenerConteoCanton(datosExportar);
      const conteoCantonesSheet = XLSX.utils.json_to_sheet(conteoCantones);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoCantonesSheet, 'conteoCantones');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
    else if(
      selectedValuesDistr.includes('top3') ||
      selectedValuesDistr.includes('top5') ||
      selectedValuesDistr.includes('top7') ||
      selectedValuesDistr.includes('top10') ||
      selectedValuesDistr.includes('top15') ||
      selectedValuesDistr.includes('top20')
    ){
      const selectedOptionDistr = selectedValuesDistr.find((option) =>
        ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'].includes(option)
      );

      const topDistr = getTopDistr(allreportes, selectedOptionDistr);
      const topDistrOptions = distrOptions.filter((option) =>
        topDistr.includes(option.value)
      );
      setSelectedDistr(topDistrOptions);
  
      const conteoDistritos = obtenerConteoDistrito(datosExportar);
      const conteoDistritosSheet = XLSX.utils.json_to_sheet(conteoDistritos);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoDistritosSheet, 'conteoDistritos');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
    else if(
      selectedValuesMateria.includes('top3') ||
      selectedValuesMateria.includes('top5') ||
      selectedValuesMateria.includes('top7') ||
      selectedValuesMateria.includes('top10') ||
      selectedValuesMateria.includes('top15')
    ){
      const selectedOptionMateria = selectedValuesMateria.find((option) =>
        ['top3', 'top5', 'top7', 'top10', 'top15'].includes(option)
      );

      const topMateria = getTopMateria(allreportes, selectedOptionMateria);
      const topMateriaOptions = materiaOptions.filter((option) =>
        topMateria.includes(option.value)
      );
      setSelectedMateria(topMateriaOptions);
  
      const conteoMaterias = obtenerConteoMateria(datosExportar);
      const conteoMateriasSheet = XLSX.utils.json_to_sheet(conteoMaterias);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoMateriasSheet, 'conteoMaterias');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
    else if(
      selectedValuesAsunto.includes('top3') ||
      selectedValuesAsunto.includes('top5') ||
      selectedValuesAsunto.includes('top7') ||
      selectedValuesAsunto.includes('top10') ||
      selectedValuesAsunto.includes('top15') ||
      selectedValuesAsunto.includes('top20')
    ){
      const selectedOptionAsunto = selectedValuesAsunto.find((option) =>
        ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'].includes(option)
      );

      const topAsunto = getTopAsunto(allreportes, selectedOptionAsunto);
      const topAsuntoOptions = asuntoOptions.filter((option) =>
        topAsunto.includes(option.value)
      );
      setSelectedAsunto(topAsuntoOptions);
  
      const conteoAsuntos = obtenerConteoAsunto(datosExportar);
      const conteoAsuntosSheet = XLSX.utils.json_to_sheet(conteoAsuntos);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoAsuntosSheet, 'conteoAsuntos');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
    else if(
      selectedValuesBien.includes('top3') ||
      selectedValuesBien.includes('top5') ||
      selectedValuesBien.includes('top7') ||
      selectedValuesBien.includes('top10') ||
      selectedValuesBien.includes('top15') ||
      selectedValuesBien.includes('top20')
    ){
      const selectedOptionBien = selectedValuesBien.find((option) =>
        ['top3', 'top5', 'top7', 'top10', 'top15', 'top20'].includes(option)
      );

      const topBien = getTopBien(allreportes, selectedOptionBien);
      const topBienOptions = bienOptions.filter((option) =>
        topBien.includes(option.value)
      );
      setSelectedBien(topBienOptions);
  
      const conteoBienes = obtenerConteoBien(datosExportar);
      const conteoBienesSheet = XLSX.utils.json_to_sheet(conteoBienes);
  
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.book_append_sheet(wb, conteoBienesSheet, 'conteoBienes');
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
      else {
      console.log('Enters else condition');
      
      const ws = XLSX.utils.json_to_sheet(datosExportar);
      const wb = XLSX.utils.book_new();
      const sheetName = 'SolicitudAsesorias';
  
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
      console.log('Writing file...');
      XLSX.writeFile(wb, 'Reporte_General.xlsx');
    }
  };
  
  const obtenerConteoAgentes = (data) => {
    const agentCount = data.reduce((acc, curr) => {
      acc[curr.Agente] = (acc[curr.Agente] || 0) + 1;
      return acc;
    }, {});
  
    const conteoAgentesArray = Object.keys(agentCount).map((agente) => ({
      Agente: agente,
      "Cantidad de Reportes": agentCount[agente],
    }));
  
    return conteoAgentesArray;
  };

  const obtenerConteoProvincia = (data) => {
    const proviCount = data.reduce((acc, curr) => {
      acc[curr.Provincia] = (acc[curr.Provincia] || 0) + 1;
      return acc;
    }, {});
  
    const conteoProvinciasArray = Object.keys(proviCount).map((provincia) => ({
      Provincia: provincia,
      "Cantidad de Reportes": proviCount[provincia],
    }));
  
    return conteoProvinciasArray;
  };

  const obtenerConteoCanton = (data) => {
    const cantoCount = data.reduce((acc, curr) => {
      acc[curr.Canton] = (acc[curr.Canton] || 0) + 1;
      return acc;
    }, {});
  
    const conteoCantonesArray = Object.keys(cantoCount).map((canton) => ({
      Canton: canton,
      "Cantidad de Reportes": cantoCount[canton],
    }));
  
    return conteoCantonesArray;
  };

  const obtenerConteoDistrito = (data) => {
    const distrCount = data.reduce((acc, curr) => {
      acc[curr.Distrito] = (acc[curr.Distrito] || 0) + 1;
      return acc;
    }, {});
  
    const conteoDistritosArray = Object.keys(distrCount).map((distrito) => ({
      Distrito: distrito,
      "Cantidad de Reportes": proviCount[distrito],
    }));
  
    return conteoDistritosArray;
  };

  const obtenerConteoMateria = (data) => {
    const materiaCount = data.reduce((acc, curr) => {
      acc[curr.Materia] = (acc[curr.Materia] || 0) + 1;
      return acc;
    }, {});
  
    const conteoMateriasArray = Object.keys(materiaCount).map((materia) => ({
      Materia: materia,
      "Cantidad de Reportes": materiaCount[materia],
    }));
  
    return conteoMateriasArray;
  };

  const obtenerConteoAsunto = (data) => {
    const asuntoCount = data.reduce((acc, curr) => {
      acc[curr.Asunto] = (acc[curr.Asunto] || 0) + 1;
      return acc;
    }, {});
  
    const conteoAsuntosArray = Object.keys(asuntoCount).map((asunto) => ({
      Asunto: asunto,
      "Cantidad de Reportes": asuntoCount[asunto],
    }));
  
    return conteoAsuntosArray;
  };

  const obtenerConteoBien = (data) => {
    const bienCount = data.reduce((acc, curr) => {
      acc[curr.Bien] = (acc[curr.Bien] || 0) + 1;
      return acc;
    }, {});
  
    const conteoBienesArray = Object.keys(bienCount).map((bien) => ({
      Bien: bien,
      "Cantidad de Reportes": bienCount[bien],
    }));
  
    return conteoBienesArray;
  };

  const exportarTodosLosDatosAPDF = () => {
    const datosExportar = JSON.parse(JSON.stringify(allreportes));
  
    const columns = [
      '# Reporte',
      'Agente',
      'Fch. Creado',
      'Estado',
      'Origen',
      'Usuario Especial',
      'Observación',
      'Tipo Ident.',
      'N. Ident.',
      'Nombre Cliente',
      '1er Apell Cliente',
      '2do Apell Cliente',
      'Correo 1',
      'Correo 2',
      'Telefono 1',
      'Telefono 2',
      'Provincia',
      'Canton',
      'Distrito',
      'Materia',
      'Asunto Consult.',
      'Bien',
      'Tipo Ident. Comerciante',
      'N. Ident. Comerciante',
      'Razon Social/Nombre Comerciante',
      'Nombre Fantasía',
      'Descripción del caso',
      'Respuesta Enviada',
    ];
  
    const rows = datosExportar.map(reporte => [
      reporte.id_report,
      reporte.id_agente,
      reporte.fchareg,
      reporte.status,
      reporte.origen_r,
      reporte.usuario_s,
      reporte.us_obser,
      reporte.tdia,
      reporte.ndia,
      reporte.nomba,
      reporte.apell1a,
      reporte.apell2a,
      reporte.email,
      reporte.email2,
      reporte.tel,
      reporte.tel2,
      reporte.provi,
      reporte.canto,
      reporte.distr,
      reporte.materia,
      reporte.asunto,
      reporte.bien,
      reporte.tdic,
      reporte.ndic,
      reporte.razon_social,
      reporte.nombre_fantasia,
      reporte.desch,
      reporte.respe,
    ]);
  
  // Crear un documento con orientación horizontal
  const doc = new jsPDF({
    orientation: 'landscape', // Configurar la orientación a horizontal
    format: 'a0',
  });
  
    doc.autoTable({
      head: [columns],
      body: rows,
    });
  
    doc.save('Reporte_General.pdf');
};

  const todosFiltrosEstanVacios = () => {
    setAllReportes(freportes);
    return (
      filtroNReport === "" &&
      selectedAgents === "" &&
      filtroFchCreado === "" &&
      selectedStatus === "" &&
      selectedOrigen === "" &&
      filtroUsuario_s === "" &&
      filtroUs_obser === "" &&
      selectedTdia === "" &&
      filtroNdia === "" &&
      filtroNomba === "" &&
      filtroApell1a === "" &&
      filtroApell2a === "" &&
      filtroEmail === "" &&
      filtroEmail2 === "" &&
      filtroTel === "" &&
      filtroTel2 === "" &&
      selectedProvi === "" &&
      selectedCanto === "" &&
      selectedDistr === "" &&
      selectedMateria === "" &&
      selectedAsunto === "" &&
      selectedBien === "" &&
      selectedTdic === "" &&
      filtroNdic === "" &&
      filtroRsocial === "" &&
      filtroFantasia === "" &&
      filtroDesch === "" &&
      filtroRespe === "" &&
      !startDateFilter &&
      !endDateFilter
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setReportes(dreportes.slice(startIndex, endIndex));
  };

  //UseEffect carga inicial

  useEffect(() => {
    setIsMounted(true); // Marcar el componente como montado cuando se monte
    return () => setIsMounted(false); // Marcar el componente como desmontado cuando se desmonte
  }, []);

  useEffect(() => {
    if (isMounted) {
      getReportes();
    }
  }, [isMounted]);

  useEffect(() => {
    if (todosFiltrosEstanVacios()) {
      handleBorrarFiltrosClick(); //Si no hay filtros aplicados
    } else {
      buscarReportes(); // Llamar a la función de búsqueda si hay filtros aplicados
    }
  }, [
    startIndex,
    endIndex,
    filtroNReport,
    selectedAgents,
    filtroFchCreado,
    selectedStatus,
    selectedOrigen,
    filtroUsuario_s,
    filtroUs_obser,
    selectedTdia,
    filtroNdia,
    filtroNomba,
    filtroApell1a,
    filtroApell2a,
    filtroEmail,
    filtroEmail2,
    filtroTel,
    filtroTel2,
    selectedProvi,
    selectedCanto,
    selectedDistr,
    selectedMateria,
    selectedAsunto,
    selectedBien,
    selectedTdic,
    filtroNdic,
    filtroRsocial,
    filtroFantasia,
    filtroDesch,
    filtroRespe,
    startDateFilter,
    endDateFilter,
  ]);

  //Funcion para borrar el filtro de fecha
  const resetDates = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
  };

  //Funcion para borrar todos los filtros
  const resetAll = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setFiltroNReport("");
    setSelectedAgents([]);
    setFiltroFchCreado("");
    setSelectedStatus([]);
    setSelectedOrigen([]);
    setFiltroUsuario_s("");
    setFiltroUs_obser("");
    setSelectedTdia([]);
    setFiltroNdia("");
    setFiltroNomba("");
    setFiltroApell1a("");
    setFiltroApell2a("");
    setFiltroEmail("");
    setFiltroEmail2("");
    setFiltroTel("");
    setFiltroTel2("");
    setSelectedProvi([]);
    setSelectedCanto([]);
    setSelectedDistr([]);
    setSelectedMateria([]);
    setSelectedAsunto([]);
    setSelectedBien([]);
    setSelectedTdic([]);
    setFiltroNdic("");
    setFiltroRsocial("");
    setFiltroFantasia("");
    setFiltroDesch("");
    setFiltroRespe("");
    filtroNReportRef.current.value = '';
    filtroFchCreadoRef.current.value = '';
    filtroUs_obserRef.current.value = '';
    filtroUsuario_sRef.current.value = '';
    filtroNdiaRef.current.value = '';
    filtroNombaRef.current.value = '';
    filtroApell1aRef.current.value = '';
    filtroApell2aRef.current.value = '';
    filtroEmailRef.current.value = '';
    filtroEmail2Ref.current.value = '';
    filtroTelRef.current.value = '';
    filtroTel2Ref.current.value = '';
    filtroNdicRef.current.value = '';
    filtroRsocialRef.current.value = '';
    filtroFantasiaRef.current.value = '';
    filtroDeschRef.current.value = '';
    filtroRespeRef.current.value = '';
    setCurrentPage(1);
  };

  //Funciones para vistas

  const opcionesSelect = [
    { label: "Origen año 2024", value: 3 },
    { label: "Origen año 2023", value: 1 },
    { label: "Origen año 2022", value: 2 },
    // Agrega más opciones si es necesario
  ];

  const descargarTabla = (opcionSeleccionada) => {
    // Obtener datos necesarios para la tabla
    const datosTabla = obtenerDatosParaTabla(opcionSeleccionada);
  
    // Crear un libro de Excel
    const libro = XLSX.utils.book_new();
    const hojaDatos = XLSX.utils.json_to_sheet(datosTabla);
    XLSX.utils.book_append_sheet(libro, hojaDatos, 'Reportes');
  
    // Escribir el libro en un array buffer
    const arrayBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  
    // Crear un blob a partir del array buffer
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Generar un enlace de descarga
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes.xlsx';
    a.click();
  
    // Limpiar el objeto URL
    URL.revokeObjectURL(url);
  };
  

  const obtenerDatosParaTabla = (opcionSeleccionada) => {
    if (opcionSeleccionada === 1) {
     // Obtén los datos necesarios para la tabla (por ejemplo, los datos filtrados)
    const datosFiltrados = allreportes.filter(reporte => {
    const [fechaPart] = reporte.fchareg.split(', ');
    const [fecha] = fechaPart.split(' ');

    const [dia, mes, ano] = fecha.split('/');
    return ano === '2023';
  });

  // Crear un objeto para almacenar el recuento de reportes por origen y mes
  const recuentoPorMesYOrigen = {};

  // Iterar sobre los reportes y contar por origen y mes
  datosFiltrados.forEach(reporte => {
    const nombreMes = obtenerNombreMes(reporte);
    const origen = reporte.origen_r;

    // Inicializar el recuento si es la primera vez que vemos este origen en este mes
    if (!recuentoPorMesYOrigen[nombreMes]) {
      recuentoPorMesYOrigen[nombreMes] = {};
    }
    if (!recuentoPorMesYOrigen[nombreMes][origen]) {
      recuentoPorMesYOrigen[nombreMes][origen] = 0;
    }

    // Incrementar el recuento
    recuentoPorMesYOrigen[nombreMes][origen]++;
  });

  // Transformar el objeto y calcular el total por origen
  const datosTabla = Object.keys(recuentoPorMesYOrigen).map(mes => {
    const recuentoPorOrigen = recuentoPorMesYOrigen[mes];
    const fila = {
      Mes: mes,
      ...recuentoPorOrigen,
    };

    // Calcular el total por origen y agregarlo a la fila
    fila.Total = Object.values(recuentoPorOrigen).reduce((total, count) => total + count, 0);

    return fila;
  });

  // Agregar la fila de totales al final
  const filaTotales = {
    Mes: 'Total',
    ...Object.keys(recuentoPorMesYOrigen).reduce((totales, mes) => {
      Object.keys(recuentoPorMesYOrigen[mes]).forEach(origen => {
        if (!totales[origen]) {
          totales[origen] = 0;
        }
        totales[origen] += recuentoPorMesYOrigen[mes][origen];
      });
      return totales;
    }, {}),
  };

  datosTabla.push(filaTotales);

  return datosTabla;
    }
    else if (opcionSeleccionada === 2) {
     // Obtén los datos necesarios para la tabla (por ejemplo, los datos filtrados)
  const datosFiltrados = allreportes.filter(reporte => {
    const [fechaPart] = reporte.fchareg.split(', ');
    const [fecha] = fechaPart.split(' ');

    const [dia, mes, ano] = fecha.split('/');
    return ano === '2022';
  });

  // Crear un objeto para almacenar el recuento de reportes por origen y mes
  const recuentoPorMesYOrigen = {};

  // Iterar sobre los reportes y contar por origen y mes
  datosFiltrados.forEach(reporte => {
    const nombreMes = obtenerNombreMes(reporte);
    const origen = reporte.origen_r;

    // Inicializar el recuento si es la primera vez que vemos este origen en este mes
    if (!recuentoPorMesYOrigen[nombreMes]) {
      recuentoPorMesYOrigen[nombreMes] = {};
    }
    if (!recuentoPorMesYOrigen[nombreMes][origen]) {
      recuentoPorMesYOrigen[nombreMes][origen] = 0;
    }

    // Incrementar el recuento
    recuentoPorMesYOrigen[nombreMes][origen]++;
  });

  // Transformar el objeto y calcular el total por origen
  const datosTabla = Object.keys(recuentoPorMesYOrigen).map(mes => {
    const recuentoPorOrigen = recuentoPorMesYOrigen[mes];
    const fila = {
      Mes: mes,
      ...recuentoPorOrigen,
    };

    // Calcular el total por origen y agregarlo a la fila
    fila.Total = Object.values(recuentoPorOrigen).reduce((total, count) => total + count, 0);

    return fila;
  });

  // Agregar la fila de totales al final
  const filaTotales = {
    Mes: 'Total',
    ...Object.keys(recuentoPorMesYOrigen).reduce((totales, mes) => {
      Object.keys(recuentoPorMesYOrigen[mes]).forEach(origen => {
        if (!totales[origen]) {
          totales[origen] = 0;
        }
        totales[origen] += recuentoPorMesYOrigen[mes][origen];
      });
      return totales;
    }, {}),
  };

  datosTabla.push(filaTotales);

  return datosTabla;
    }
    else if (opcionSeleccionada === 3) {
      // Obtén los datos necesarios para la tabla (por ejemplo, los datos filtrados)
   const datosFiltrados = allreportes.filter(reporte => {
     const [fechaPart] = reporte.fchareg.split(', ');
     const [fecha] = fechaPart.split(' ');
 
     const [dia, mes, ano] = fecha.split('/');
     return ano === '2024';
   });
 
   // Crear un objeto para almacenar el recuento de reportes por origen y mes
   const recuentoPorMesYOrigen = {};
 
   // Iterar sobre los reportes y contar por origen y mes
   datosFiltrados.forEach(reporte => {
     const nombreMes = obtenerNombreMes(reporte);
     const origen = reporte.origen_r;
 
     // Inicializar el recuento si es la primera vez que vemos este origen en este mes
     if (!recuentoPorMesYOrigen[nombreMes]) {
       recuentoPorMesYOrigen[nombreMes] = {};
     }
     if (!recuentoPorMesYOrigen[nombreMes][origen]) {
       recuentoPorMesYOrigen[nombreMes][origen] = 0;
     }
 
     // Incrementar el recuento
     recuentoPorMesYOrigen[nombreMes][origen]++;
   });
 
   // Transformar el objeto y calcular el total por origen
   const datosTabla = Object.keys(recuentoPorMesYOrigen).map(mes => {
     const recuentoPorOrigen = recuentoPorMesYOrigen[mes];
     const fila = {
       Mes: mes,
       ...recuentoPorOrigen,
     };
 
     // Calcular el total por origen y agregarlo a la fila
     fila.Total = Object.values(recuentoPorOrigen).reduce((total, count) => total + count, 0);
 
     return fila;
   });
 
   // Agregar la fila de totales al final
   const filaTotales = {
     Mes: 'Total',
     ...Object.keys(recuentoPorMesYOrigen).reduce((totales, mes) => {
       Object.keys(recuentoPorMesYOrigen[mes]).forEach(origen => {
         if (!totales[origen]) {
           totales[origen] = 0;
         }
         totales[origen] += recuentoPorMesYOrigen[mes][origen];
       });
       return totales;
     }, {}),
   };
 
   datosTabla.push(filaTotales);
 
   return datosTabla;
     }
  };
  
  const obtenerNombreMes = (reporte) => {
    const [fechaPart] = reporte.fchareg.split(', ');
    const [fecha] = fechaPart.split(' ');
  
    const [dia, mes, ano] = fecha.split('/');
    const fechaDate = new Date(ano, mes - 1, dia);
  
    const opcionesNombreMes = { month: 'long' };
    let nombreMes = new Intl.DateTimeFormat('es-ES', opcionesNombreMes).format(fechaDate);
  
    // Asegurarse de que la primera letra esté en mayúscula
    nombreMes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  
    return nombreMes;
  };  

  return (
    <>
      <nav className="navbar bg-white fixed-top position-fixed top-0 shadow" style={{ background: "rgba(255, 255, 255, 0.8)" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <img
            src={meicimg}
            alt="MEIC"
            width="140"
            height="55"
            className="d-flex justify-content-start"
          />
          <p className="fs-2 fw-bolder text-center clrTitle">
            LISTADO DE FORMULARIOS MEIC
          </p>
          <p className="mt-5 text-secondary d-flex flex-row-reverse">
            Agente: {agente}
          </p>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Opciones
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link
                    to={"/home"}
                    id="btnenviar"
                    type="buttom"
                    className="nav-link"
                    aria-current="page"
                  >
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href={"/formpres"}
                    id="btnenviar"
                    className="nav-link"
                    aria-current="page"
                  >
                    Formularios de Asesoria
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={"/stadistic"}
                    id="btnenviar"
                    type="button"
                    className="nav-link"
                    aria-current="page"
                  >
                    Estadisticas
                  </a>
                </li>
                <li className="nav-item">
                  <Link
                    to={"/"}
                    id="btncerrar"
                    type="button"
                    className="nav-link"
                    onClick={() => CerrarSession()}
                    aria-current="page"
                  >
                    Salir
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          </div>
          <div className="d-flex flex-row mb-1 ms-2">
          <button
            className="btn btn-success"
            onClick={() => exportarTodosLosDatos()}
          >
            Exportar a Excel
          </button>
          <button
            className="pdf btnpdf"
            onClick={() => exportarTodosLosDatosAPDF()}
            style={{ marginLeft: 10 }}
          >
            Exportar a PDF
          </button>
          <div className="d-flex flex-row mb-0 ms-2 datepicker">
            <DatePicker.default
              selected={startDateFilter}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDateFilter}
              endDate={endDateFilter}
              placeholderText="Fecha inicial"
              dateFormat="dd/MM/yyyy, HH:mm:ss"
            />
            <DatePicker.default
              selected={endDateFilter}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDateFilter}
              endDate={endDateFilter}
              placeholderText="Fecha final"
              dateFormat="dd/MM/yyyy, HH:mm:ss"
            />
          </div>
          <button className="btn btn-success" onClick={() => resetDates()}>
            Eliminar fechas
          </button>
          <button
            className="deletebtn btndelete"
            onClick={() => resetAll()}
            style={{ marginLeft: 10 }}
          >
            Eliminar filtros
          </button>
          <nav aria-label="...">
            <ul className="d-flex flex-row mb-1 ms-2 pagination">
              <li className="page-item">
                <select
                  className="form-select"
                  onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  value={currentPage}
                >
                  {Array.from({ length: numPaginas }, (_, i) => (
                    <option key={i} value={i + 1}>
                      Pg. {i + 1}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </nav>
          <Select
            onChange={(selectedOption) => descargarTabla(selectedOption.value)}
            options={opcionesSelect}
            placeholder="Vistas"
            className="custom-select"
          />
          <div className="d-flex flex-row mb-1 ms-2 pagination-info">Datos mostrados: {rowsCount}</div>
        </div>
      </nav>
      <div className="container-fluid position-absolute start-0 w-auto p-3">
        <table class="table table-container table-bordered table-striped table-hover">
          {/*<caption>Reportes solicitud de asesoria presencial</caption>*/}
          <thead>
            <tr>
              <th scope="col"># Reporte</th>
              <th scope="col" class="agente-column">Agente</th>
              <th scope="col">Creado</th>
              <th scope="col" class="status-column">Estado</th>
              <th scope="col" class="origen-column">Origen</th>
              <th scope="col">Usuario Esp.</th>
              <th scope="col">Observación</th>
              <th scope="col" class="tid-column">Tipo Ident.</th>
              <th scope="col">N. Ident.</th>
              <th scope="col">Nombre Cliente</th>
              <th scope="col">1er Apell Cliente</th>
              <th scope="col">2do Apell Cliente</th>
              <th scope="col">Correo 1</th>
              <th scope="col">Correo 2</th>
              <th scope="col">Telefono 1</th>
              <th scope="col">Telefono 2</th>
              <th scope="col" class="provi-column">Provincia</th>
              <th scope="col" class="canto-column">Canton</th>
              <th scope="col" class="distr-column">Distrito</th>
              <th scope="col" class="materia-column">Materia</th>
              <th scope="col" class="asunto-column">Asunto Consult.</th>
              <th scope="col" class="bien-column">Bien</th>
              <th scope="col" class="tid-column">Tipo Ident. Comerciante</th>
              <th scope="col">N. Ident. Comerciante</th>
              <th scope="col">Razon Social/Nombre Comerciante</th>
              <th scope="col">Nombre Fantasía</th>
              <th scope="col">Descripción del caso</th>
              <th scope="col">Respuesta Enviada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input id="buscarNReport" ref={filtroNReportRef} onChange={handleFiltroNReport} />
              </td>
              <td>
                <Select
                  isMulti
                  options={agentOptions}
                  value={selectedAgents}
                  placeholder="Seleccione"
                  onChange={handleSelectAgent}
                />
              </td>
              <td>
                <input id="buscarFchCreado" ref={filtroFchCreadoRef} onChange={handleFiltroFchCreado} />
              </td>
              <td>
                <Select
                  isMulti
                  options={statusOptions}
                  value={selectedStatus}
                  placeholder="Seleccione"
                  onChange={handleSelectStatus}
                />
              </td>
              <td>
                <Select
                  isMulti
                  options={origenOptions}
                  value={selectedOrigen}
                  placeholder="Seleccione"
                  onChange={handleSelectOrigen}
                />
              </td>
              <td>
                <input id="buscarUsuario_s" ref={filtroUsuario_sRef} onChange={handleFiltroUsuario_s} />
              </td>
              <td>
                <input id="buscarUs_obser" ref={filtroUs_obserRef} onChange={handleFiltroUs_obser} />
              </td>
              <td>
                <Select
                  isMulti
                  options={tdiaOptions}
                  value={selectedTdia}
                  placeholder="Seleccione"
                  onChange={handleSelectTdia}
                />
              </td>
              <td>
                <input id="buscarNdia" ref={filtroNdiaRef} onChange={handleFiltroNdia} />
              </td>
              <td>
                <input id="buscarNomba" ref={filtroNombaRef} onChange={handleFiltroNomba} />
              </td>
              <td>
                <input id="buscarApell1a" ref={filtroApell1aRef} onChange={handleFiltroApell1a} />
              </td>
              <td>
                <input id="buscarApell2a" ref={filtroApell2aRef} onChange={handleFiltroApell2a} />
              </td>
              <td>
                <input id="buscarEmail" ref={filtroEmailRef} onChange={handleFiltroEmail} />
              </td>
              <td>
                <input id="buscarEmail2" ref={filtroEmail2Ref} onChange={handleFiltroEmail2} />
              </td>
              <td>
                <input id="buscarTel" ref={filtroTelRef} onChange={handleFiltroTel} />
              </td>
              <td>
                <input id="buscarTel2" ref={filtroTel2Ref} onChange={handleFiltroTel2} />
              </td>
              <td>
              <Select
                  isMulti
                  options={proviOptions}
                  value={selectedProvi}
                  placeholder="Seleccione"
                  onChange={handleSelectProvi}
                />
              </td>
              <td>
              <Select
                  isMulti
                  options={cantoOptions}
                  value={selectedCanto}
                  placeholder="Seleccione"
                  onChange={handleSelectCanto}
                />
              </td>
              <td>
              <Select
                  isMulti
                  options={distrOptions}
                  value={selectedDistr}
                  placeholder="Seleccione"
                  onChange={handleSelectDistr}
                />
              </td>
              <td>
                <Select
                  isMulti
                  options={materiaOptions}
                  value={selectedMateria}
                  placeholder="Seleccione"
                  onChange={handleSelectMateria}
                />
              </td>
              <td>
                <Select
                  isMulti
                  options={asuntoOptions}
                  value={selectedAsunto}
                  placeholder="Seleccione"
                  onChange={handleSelectAsunto}
                />
              </td>
              <td>
                <Select
                  isMulti
                  options={bienOptions}
                  value={selectedBien}
                  placeholder="Seleccione"
                  onChange={handleSelectBien}
                />
              </td>
              <td>
                <Select
                  isMulti
                  options={tdicOptions}
                  value={selectedTdic}
                  placeholder="Seleccione"
                  onChange={handleSelectTdic}
                />
              </td>
              <td>
                <input id="buscarNdic" ref={filtroNdicRef} onChange={handleFiltroNdic} />
              </td>
              <td>
                <input id="buscarRsocial" ref={filtroRsocialRef} onChange={handleFiltroRsocial} />
              </td>
              <td>
                <input id="buscarFantasia" ref={filtroFantasiaRef} onChange={handleFiltroFantasia} />
              </td>
              <td>
                <input id="buscarDesch" ref={filtroDeschRef} onChange={handleFiltroDesch} />
              </td>
              <td>
                <input id="buscarRespe" ref={filtroRespeRef} onChange={handleFiltroRespe} />
              </td>
            </tr>
            {reportes.map((dreportes) => (
              <tr key={dreportes.id}>
                <th className="fixed-width-select" scope="row"><a href={`/edit?id=${dreportes.id}`}>{dreportes.id_report}</a></th>
                <td class="red-text">{dreportes.id_agente}</td>
                <td>{dreportes.fchareg}</td>
                <td>{dreportes.status}</td>
                <td>{dreportes.origen_r}</td>
                <td>{dreportes.usuario_s}</td>
                <td>{dreportes.us_obser}</td>
                <td>{dreportes.tdia}</td>
                <td>{dreportes.ndia}</td>
                <td>{dreportes.nomba}</td>
                <td>{dreportes.apell1a}</td>
                <td>{dreportes.apell2a}</td>
                <td>{dreportes.email}</td>
                <td>{dreportes.email2}</td>
                <td>{dreportes.tel}</td>
                <td>{dreportes.tel2}</td>
                <td>{dreportes.provi}</td>
                <td>{dreportes.canto}</td>
                <td>{dreportes.distr}</td>
                <td>{dreportes.materia}</td>
                <td>{dreportes.asunto}</td>
                <td>{dreportes.bien}</td>
                <td>{dreportes.tdic}</td>
                <td>{dreportes.ndic}</td>
                <td>{dreportes.razon_social}</td>
                <td>{dreportes.nombre_fantasia}</td>
                <td>{dreportes.desch}</td>
                <td>{dreportes.respe}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Este es el paginador viejo
        
        <nav aria-label="...">
    <ul className="pagination">
      {Array.from({ length: numPaginas }, (_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
        >
          <a
            className="page-link"
            href="#"
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </a>
        </li>
      ))}
    </ul>
  </nav>
        
        <nav aria-label="...">
  <ul className="pagination">
    {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
      <li
        key={i}
        className={`page-item ${currentPage === startPage + i ? "active" : ""}`}
      >
        <a
          className="page-link"
          href="#"
          onClick={() => handlePageChange(startPage + i)}
        >
          {startPage + i}
        </a>
      </li>
    ))}
  </ul>
</nav>*/}
        <nav aria-label="...">
          <ul className="pagination">
            <li className="page-item">
              <select
                className="form-select"
                onChange={(e) => {
                  handlePageChange(parseInt(e.target.value));
                  window.scrollTo(0, 0); // Esta línea volverá al principio de la página
                }}
                value={currentPage}
              >
                {Array.from({ length: numPaginas }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Pg. {i + 1}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Dashboard;
