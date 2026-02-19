import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, endOfDay } from "date-fns";
import * as XLSX from "xlsx";
import Select from "react-select";
import "./racsabackup.css";

const cookies = new Cookies();
const meicimg = "logo_meic.jpg"; 
const URI = "https://fwmback-production.up.railway.app/racsabackup/";

function RacsaBackup() {
const infoCookie = cookies.get("info");
const [agente, setAgente] = useState(() => {
    if (!infoCookie) return {};
    // Si ya es un objeto, lo usamos; si es string, intentamos parsear
    if (typeof infoCookie === "object") return infoCookie;
    try {
        return JSON.parse(infoCookie);
    } catch (e) {
        // Si falla el parseo (como te pasó), asumimos que el string es el nombre directamente
        return { nombre: infoCookie };
    }
});
  const [backups, setBackups] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [filtrosTexto, setFiltrosTexto] = useState({
    id_report: "", tel_origen: "", ndia: "", nomba: "", 
    apell1a: "", apell2a: "", email: "", tel: "", tel2: "", 
    razon_social: "", ndic: "", desch: "", respe: ""
  });

  const [filtrosMulti, setFiltrosMulti] = useState({
    id_agente: [], status: [], origen_r: [], tdia: [], provi: [], 
    canto: [], distr: [], materia: [], asunto: [], bien: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [registrosPorPagina] = useState(50);

  useEffect(() => {
    if (!cookies.get("info")) { window.location.href = "/"; }
    getBackups();
  }, []);

  const getBackups = async () => {
    try {
        const res = await axios.get(URI);
        setBackups(res.data);
    } catch (error) { console.error("Error:", error); }
  };

  // --- LÓGICA DE FILTRADO (Se movió arriba para ser usada por los selectores) ---
  const filteredData = backups.filter((item) => {
    const fechaItem = new Date(item.fchareg);
    const matchFecha = (!startDate || fechaItem >= startOfDay(startDate)) && 
                       (!endDate || fechaItem <= endOfDay(endDate));
    
    const matchTexto = Object.keys(filtrosTexto).every(key => 
      item[key]?.toString().toLowerCase().includes(filtrosTexto[key].toLowerCase())
    );

    const matchMulti = Object.keys(filtrosMulti).every(key => {
      if (filtrosMulti[key].length === 0) return true;
      return filtrosMulti[key].some(option => option.value === item[key]);
    });

    return matchFecha && matchTexto && matchMulti;
  });

  // --- FUNCIÓN CLAVE: Obtiene opciones BASADAS EN EL FILTRADO ACTUAL ---
  const getDynamicOptions = (column) => {
    // Si no hay filtros aplicados en OTRAS columnas, mostramos todo.
    // Pero para que sea en cascada, evaluamos los datos que YA pasaron los filtros.
    const values = filteredData.map(item => item[column]).filter(v => v);
    const uniqueValues = [...new Set(values)].sort();
    return uniqueValues.map(val => ({ value: val, label: val }));
  };

  const handleTextFilterChange = (e) => {
    setFiltrosTexto({ ...filtrosTexto, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    setFiltrosMulti({ ...filtrosMulti, [field]: selectedOptions || [] });
    setCurrentPage(1);
  };

  const CerrarSession = () => {
    if (confirm("¿Desea salir?")) {
      cookies.remove("info"); cookies.remove("token");
      window.location.href = "/";
    }
  };

const renderFilter = (name, isMultiSelect = false) => {
  if (isMultiSelect) {
    return (
      <Select
        isMulti
        options={getDynamicOptions(name)}
        onChange={(opt) => handleMultiSelectChange(opt, name)}
        className="text-dark"
        placeholder="Seleccione"
        value={filtrosMulti[name]}
        styles={{
            control: (base) => ({ ...base, minHeight: '31px', fontSize: '12px', fontWeight: 'normal' }),
        }}
      />
    );
  }
  return (
    <input
      name={name}
      value={filtrosTexto[name]}
      onChange={handleTextFilterChange}
      className="form-control form-control-sm"
      placeholder="Buscar..."
    />
  );
};

const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
};

const resetAll = () => {
    setFiltrosTexto({
        id_report: "", tel_origen: "", ndia: "", nomba: "", 
        apell1a: "", apell2a: "", email: "", tel: "", tel2: "", 
        razon_social: "", ndic: "", desch: "", respe: ""
    });
    setFiltrosMulti({
        id_agente: [], status: [], origen_r: [], tdia: [], provi: [], 
        canto: [], distr: [], materia: [], asunto: [], bien: []
    });
    resetDates();
};

const exportarTodosLosDatos = () => {
  const datosParaExcel = filteredData.map(item => ({
    "Número de Reporte": item.id_report,
    "Fecha de Registro": item.fchareg,
    "Agente": item.id_agente,
    "Estado": item.status,
    "Origen": item.origen_r,
    "Teléfono Origen": item.tel_origen,
    "Tipo Identificación": item.tdia,
    "Cédula/ID": item.ndia,
    "Nombre Cliente": item.nomba,
    "Primer Apellido": item.apell1a,
    "Segundo Apellido": item.apell2a,
    "Correo Electrónico": item.email,
    "Teléfono 1": item.tel,
    "Teléfono 2": item.tel2,
    "Provincia": item.provi,
    "Cantón": item.canto,
    "Distrito": item.distr,
    "Materia": item.materia,
    "Asunto": item.asunto,
    "Bien": item.bien,
    "Razón Social": item.razon_social,
    "ID Comercio": item.ndic,
    "Descripción": item.desch,
    "Respuesta": item.respe
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte RACSA");
  XLSX.writeFile(workbook, "Reporte_RACSA_Final.xlsx");
};

  const registrosActuales = filteredData.slice((currentPage - 1) * registrosPorPagina, currentPage * registrosPorPagina);
  const numPaginas = Math.ceil(filteredData.length / registrosPorPagina);

  return (
    <div className="container-fluid" style={{ marginTop: "115px" }}>
      <div className="row">
        <div className="col-md-10 mt-2">

          <nav className="navbar bg-white fixed-top shadow" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <img src={meicimg} alt="MEIC" width="140" height="55" />
          <p className="fs-3 fw-bolder text-center clrTitle m-0">HISTORICO MEIC</p>
          <p className="text-secondary m-0">Agente: <span className="fw-bold">{agente?.nombre}</span></p>

          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Opciones</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item"><Link to="/home" className="nav-link">Inicio</Link></li>
                <li className="nav-item"><a href="/dashboard" className="nav-link">Listado de formularios</a></li>
                <li className="nav-item"><a href="/formpres" className="nav-link">Formularios de Asesoría</a></li>
                <li className="nav-item"><a href="/stadistic" className="nav-link">Estadísticas</a></li>
                <hr />
                <li className="nav-item"><button onClick={CerrarSession} className="nav-link btn text-start text-danger w-100">Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BARRA DE HERRAMIENTAS (EXPORT Y FILTROS TEMPORALES) */}
        <div className="container-fluid d-flex flex-wrap align-items-center gap-2 mt-2 pb-2 border-top pt-2">
          {/*<div className="d-flex flex-row mb-0 ms-2 datepicker">
            <DatePicker.default
              selected={startDateFilter}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDateFilter}
              endDate={endDateFilter}
              placeholderText="Fecha inicial"
              dateFormat="dd/MM/yy HH:mm:ss"
            />
            <DatePicker.default
              selected={endDateFilter}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDateFilter}
              endDate={endDateFilter}
              placeholderText="Fecha final"
              dateFormat="dd/MM/yy HH:mm:ss"
            />
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={resetDates}>Eliminar fechas</button>*/}
          <div className="d-flex justify-content-end gap-2">
            {/*<button className="btn btn-danger btn-sm" onClick={resetAll}>
              Eliminar filtros
            </button>*/}
            <button className="btn btn-success btn-sm" onClick={exportarTodosLosDatos}>
              Exportar a Excel
            </button>
          </div>
          <nav aria-label="...">
            <ul className="pagination mb-0">
              <li className="page-item">
                <select className="form-select form-select-sm" value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))}>
                  {Array.from({ length: numPaginas }, (_, i) => (<option key={i} value={i + 1}>Pg. {i + 1}</option>))}
                </select>
              </li>
            </ul>
          </nav>
        </div>
      </nav>

<div className="table-responsive shadow-sm position-absolute start-0">
  <table className="table table-striped table-bordered table-sm align-top small">
    <thead className="table-dark sticky-top text-center">
      <tr>
        <th style={{minWidth: "130px"}}># Reporte <br/>{renderFilter("id_report")}</th>
        <th style={{minWidth: "130px"}}>Creado <br/>{renderFilter("fchareg")}</th>
        
        {/* SELECTORES EN CASCADA */}
        <th style={{minWidth: "220px"}}>Agente <br/>
          <Select isMulti options={getDynamicOptions("id_agente")} onChange={(opt) => handleMultiSelectChange(opt, "id_agente")} className="text-dark" placeholder="Filtrar Agente" />
        </th>
        <th style={{minWidth: "180px"}}>Estado <br/>
          <Select isMulti options={getDynamicOptions("status")} onChange={(opt) => handleMultiSelectChange(opt, "status")} className="text-dark" placeholder="Filtrar Estado" />
        </th>
        <th style={{minWidth: "180px"}}>Origen <br/>
          <Select isMulti options={getDynamicOptions("origen_r")} onChange={(opt) => handleMultiSelectChange(opt, "origen_r")} className="text-dark" placeholder="Filtrar Origen" />
        </th>
        
        <th style={{minWidth: "150px"}}>Tel. Origen <br/><input name="tel_origen" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "180px"}}>Tipo Ident. <br/>
          <Select isMulti options={getDynamicOptions("tdia")} onChange={(opt) => handleMultiSelectChange(opt, "tdia")} className="text-dark" placeholder="Filtrar Tipo" />
        </th>

        <th style={{minWidth: "150px"}}>N. Ident. <br/><input name="ndia" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "150px"}}>Cliente <br/><input name="nomba" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "150px"}}>1er Apell <br/><input name="apell1a" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "150px"}}>2do Apell <br/><input name="apell2a" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "150px"}}>Correo <br/><input name="email" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "120px"}}>Tel 1 <br/><input name="tel" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "120px"}}>Tel 2 <br/><input name="tel2" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>

        <th style={{minWidth: "200px"}}>Provincia <br/>
          <Select isMulti options={getDynamicOptions("provi")} onChange={(opt) => handleMultiSelectChange(opt, "provi")} className="text-dark" placeholder="Filtrar Prov." />
        </th>
        <th style={{minWidth: "200px"}}>Cantón <br/>
          <Select isMulti options={getDynamicOptions("canto")} onChange={(opt) => handleMultiSelectChange(opt, "canto")} className="text-dark" placeholder="Filtrar Cantón" />
        </th>
        <th style={{minWidth: "200px"}}>Distrito <br/>
          <Select isMulti options={getDynamicOptions("distr")} onChange={(opt) => handleMultiSelectChange(opt, "distr")} className="text-dark" placeholder="Filtrar Dist." />
        </th>

        <th style={{minWidth: "200px"}}>Materia <br/>
          <Select isMulti options={getDynamicOptions("materia")} onChange={(opt) => handleMultiSelectChange(opt, "materia")} className="text-dark" placeholder="Filtrar Mat." />
        </th>
        <th style={{minWidth: "200px"}}>Asunto <br/>
          <Select isMulti options={getDynamicOptions("asunto")} onChange={(opt) => handleMultiSelectChange(opt, "asunto")} className="text-dark" placeholder="Filtrar Asunto" />
        </th>
        <th style={{minWidth: "200px"}}>Bien <br/>
          <Select isMulti options={getDynamicOptions("bien")} onChange={(opt) => handleMultiSelectChange(opt, "bien")} className="text-dark" placeholder="Filtrar Bien" />
        </th>

        <th style={{minWidth: "150px"}}>Razón Social <br/><input name="razon_social" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "150px"}}>N. Ident. Com. <br/><input name="ndic" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "350px"}}>Descripción <br/><input name="desch" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
        <th style={{minWidth: "350px"}}>Respuesta <br/><input name="respe" onChange={handleTextFilterChange} className="form-control form-control-sm"/></th>
      </tr>
    </thead>
    <tbody>
      {registrosActuales.map((item) => (
        <tr key={item.id}>
          <td>{item.id_report}</td>
          <td>{item.fchareg}</td>
          <td>{item.id_agente}</td>
          <td><span className={`badge ${item.status === 'Finalizado' ? 'bg-success' : 'bg-warning text-dark'}`}>{item.status}</span></td>
          <td>{item.origen_r}</td>
          <td>{item.tel_origen}</td>
          <td>{item.tdia}</td>
          <td>{item.ndia}</td>
          <td>{item.nomba}</td>
          <td>{item.apell1a}</td>
          <td>{item.apell2a}</td>
          <td>{item.email}</td>
          <td>{item.tel}</td>
          <td>{item.tel2}</td>
          <td>{item.provi}</td>
          <td>{item.canto}</td>
          <td>{item.distr}</td>
          <td>{item.materia}</td>
          <td>{item.asunto}</td>
          <td>{item.bien}</td>
          <td>{item.razon_social}</td>
          <td>{item.ndic}</td>
          <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{item.desch}</td>
          <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{item.respe}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>
      </div>
    </div>
  );
}

export default RacsaBackup;