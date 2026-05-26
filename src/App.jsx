// src/App.jsx
import { useMemo, useState } from "react";
import {
  Building2,
  Camera,
  CarFront,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Route,
  Save,
  UserCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import fondo3 from "./assets/fondo3.jpeg";
import { apiChecklistGeneral } from "./lib/apiChecklistGeneral";

const ASESORES_VOLVO = [
  "Edgar Valencia",
  "Carlos Macedonio",
  "Luis Enrique Ramos",
  "Juan Carlos Ubaldo",
];

const CHECKLIST_GENERAL = [
  {
    titulo: "1. Validación administrativa previa",
    items: [
      ["pre_factura_preparada", "Pre-factura preparada", true],
      ["orden_servicio_final_impresa_firmas", "Orden de servicio final impresa con firmas", true],
      ["garantias_documentadas", "Garantías documentadas", true],
      ["salida_almacen", "Salida de almacén", true],
    ],
  },
  {
    titulo: "2. Validación técnica final en taller",
    items: [
      ["torque_correcto_componentes", "Verificar torque correcto en componentes intervenidos", true],
      ["ausencia_fugas", "Validar ausencia de fugas", true],
      ["niveles_fluidos_correctos", "Confirmar niveles correctos de fluidos", true],
      ["instalacion_piezas_conectores", "Verificar correcta instalación de piezas y conectores", true],
      ["escaneo_final_realizado", "Escaneo final realizado", true],
      ["sin_codigos_dtc_activos", "Sin códigos DTC activos", true],
      ["reinicio_recordatorios_mantenimiento", "Reinicio correcto de recordatorios de mantenimiento", true],
      ["apriete_ruedas", "Confirmar apriete de ruedas", true],
      ["presion_neumaticos", "Verificar presión de neumáticos", true],
      ["funcionamiento_frenos", "Confirmar funcionamiento de frenos", true],
      ["funcionamiento_luces", "Verificar funcionamiento de luces", true],
      ["limpiaparabrisas_lavaparabrisas", "Verificar limpiaparabrisas y lavaparabrisas", true],
      ["funcionamiento_cinturones", "Validar funcionamiento de cinturones", true],
    ],
  },
  {
    titulo: "3. Checklist de prueba de manejo",
    ayuda: "Obligatorio para diagnósticos y cambios de frenos. Si no aplica, desactiva la prueba.",
    tipo: "prueba",
    items: [
      ["encendido_correcto", "Encendido correcto", true],
      ["marcha_minima_estable", "Marcha mínima estable", true],
      ["sin_vibraciones_anormales_ruta", "Sin vibraciones anormales", true],
      ["aceleracion_normal", "Aceleración normal", true],
      ["sin_perdida_potencia", "Sin pérdida de potencia", true],
      ["temperatura_operacion_normal", "Temperatura de operación normal", true],
      ["sin_ruidos_interiores", "Sin ruidos interiores", true],
      ["sin_olores_extranos", "Sin olores extraños", true],
      ["cambios_suaves_acople_marchas", "Cambios suaves y acople de marchas", true],
      ["sin_jaloneos", "Sin jaloneos", true],
      ["sin_ruidos_anormales_transmision", "Sin ruidos anormales en transmisión", true],
      ["sin_ruidos_suspension", "Sin ruidos en suspensión", true],
      ["alineacion_validada", "Alineación validada", true],
      ["frenos_sin_ruidos_rechinidos", "Frenos sin ruidos o rechinidos", true],
      ["aire_acondicionado_funcional", "Aire acondicionado funcional", true],
      ["audio_pantalla_funcionales", "Audio y pantalla funcionales", true],
    ],
  },
  {
    titulo: "4. Inspección estética final",
    items: [
      ["vehiculo_lavado", "Vehículo lavado", true],
      ["sin_manchas_grasa", "Sin manchas de grasa", true],
      ["cofre_puertas_cajuela_limpias", "Cofre, puertas y cajuela limpias", true],
      ["sin_danos_nuevos", "Sin daños nuevos", true],
      ["proteccion_removida_correctamente", "Protección removida correctamente", true],
      ["asientos_limpios", "Asientos limpios", true],
      ["volante_palanca_limpios", "Volante y palanca limpios", true],
      ["tapetes_limpios", "Tapetes limpios", true],
      ["sin_residuos_taller", "Sin residuos de taller", true],
      ["sin_herramientas_olvidadas", "Sin herramientas olvidadas", true],
    ],
  },
  {
    titulo: "5. Validación final de calidad (ANDON)",
    items: [
      ["checklist_completo_firmado", "Checklist completo y firmado", true],
      ["prueba_manejo_validada", "Prueba de manejo validada", true],
      ["sin_pendientes_tecnicos", "Sin pendientes técnicos", true],
      ["vehiculo_listo_entrega", "Vehículo listo para entrega", true],
      ["asesor_informado_liberacion", "Asesor informado de liberación", true],
    ],
  },
  {
    titulo: "6. Confirmación previa a entrega con cliente",
    items: [
      ["explicar_trabajos_realizados", "Explicar trabajos realizados", true],
      ["explicar_pruebas_efectuadas", "Explicar pruebas efectuadas", true],
      ["explicar_garantia", "Explicar garantía", true],
      ["informar_recomendaciones_futuras", "Informar recomendaciones futuras", true],
      ["resolver_dudas_cliente", "Resolver dudas del cliente", true],
      ["revisar_unidad_junto_cliente", "Revisar unidad junto al cliente", true],
      ["recordatorio_encuesta_satisfaccion", "Recordatorio de encuesta de satisfacción", true],
      ["confirmar_refacciones_cliente", "Confirmar con el cliente si requiere llevarse sus refacciones reemplazadas", false],
      ["concientizacion_residuo_peligroso", "Si aplica residuo peligroso, firmar concientización de riesgos y explicar sugerencias", false],
    ],
  },
];

const PRUEBA_IDS = new Set(
  CHECKLIST_GENERAL.find((section) => section.tipo === "prueba").items.map(([id]) => id),
);

const FORM_INICIAL = {
  agencia: "Volvo",
  nombre: "",
  telefono: "",
  correo: "",
  asesor_servicio: "",
  tecnico_inspector: "",
  gerente_servicio: "",
  pst: "",
  placas: "",
  vin: "",
  modelo: "",
  kilometraje: "",
  orden_servicio: "",
  fecha_hora_revision: dateTimeLocalActual(),
  requiere_prueba_manejo: true,
  fecha_prueba: fechaActual(),
  hora_prueba: horaActual(),
  kilometraje_inicial: "",
  kilometraje_final: "",
  observaciones: "",
  descripcion_evidencia: "",
};

function dateTimeLocalActual() {
  const date = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function fechaActual() {
  const date = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function horaActual() {
  const date = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function soloNumeros(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizarTelefonoMx(value) {
  const digits = soloNumeros(value);
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

function telefonoValido(value) {
  const digits = soloNumeros(value);
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("52"));
}

function emailValido(value) {
  const email = String(value || "").trim();
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function cls(...values) {
  return values.filter(Boolean).join(" ");
}

function Field({ label, icon: Icon, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-white/70">
        {Icon ? <Icon className="h-3.5 w-3.5 text-white/45" /> : null}
        {label}
      </label>

      {children}

      {error ? <p className="mt-1 text-[11px] font-bold text-red-200">{error}</p> : null}
    </div>
  );
}

function Input({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      className={cls(
        "h-11 w-full rounded-xl border bg-white/10 px-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35",
        error ? "border-red-200 ring-2 ring-red-300/20" : "border-white/10 focus:border-white/40 focus:ring-2 focus:ring-white/10",
        className,
      )}
    />
  );
}

function Select({ error, className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={cls(
        "h-11 w-full rounded-xl border bg-[#0b1b54]/95 px-3 text-sm font-bold text-white outline-none transition",
        error ? "border-red-200 ring-2 ring-red-300/20" : "border-white/10 focus:border-white/40 focus:ring-2 focus:ring-white/10",
        className,
      )}
    >
      {children}
    </select>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={cls(
        "min-h-[92px] w-full resize-y rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-white/40 focus:ring-2 focus:ring-white/10",
        className,
      )}
    />
  );
}

function EstadoButton({ active, children, onClick, tone, disabled }) {
  const activeClass = {
    ok: "border-emerald-300/40 bg-emerald-400/20 text-emerald-100",
    observacion: "border-amber-300/40 bg-amber-400/20 text-amber-100",
    na: "border-slate-300/40 bg-slate-400/20 text-slate-100",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cls(
        "h-9 rounded-xl border px-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40",
        active ? activeClass : "border-white/10 bg-white/10 text-white/55 hover:bg-white/20",
      )}
    >
      {children}
    </button>
  );
}

function ChecklistCard({ checklist, onChange, requierePrueba }) {
  function setEstado(itemId, estado) {
    onChange((prev) => {
      const actual = prev[itemId] || { estado: "", comentario: "" };
      const nextEstado = actual.estado === estado ? "" : estado;
      const next = { ...prev, [itemId]: { ...actual, estado: nextEstado } };

      if (!next[itemId].estado && !next[itemId].comentario) {
        delete next[itemId];
      }

      return next;
    });
  }

  function setComentario(itemId, comentario) {
    onChange((prev) => {
      const actual = prev[itemId] || { estado: "", comentario: "" };
      const next = { ...prev, [itemId]: { ...actual, comentario } };

      if (!next[itemId].estado && !next[itemId].comentario) {
        delete next[itemId];
      }

      return next;
    });
  }

  function marcarSeccion(items, estado) {
    onChange((prev) => {
      const next = { ...prev };

      items.forEach(([itemId, _description, obligatorio]) => {
        if (!requierePrueba && PRUEBA_IDS.has(itemId)) return;
        if (estado === "na" && obligatorio) return;

        next[itemId] = {
          ...(next[itemId] || { comentario: "" }),
          estado,
        };
      });

      return next;
    });
  }

  return (
    <div className="space-y-3">
      {CHECKLIST_GENERAL.map((section) => {
        if (section.tipo === "prueba" && !requierePrueba) return null;

        return (
          <section key={section.titulo} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
            <div className="flex flex-col gap-2 border-b border-white/10 bg-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-black text-white">{section.titulo}</h3>
                {section.ayuda ? <p className="mt-1 text-xs font-semibold text-white/45">{section.ayuda}</p> : null}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => marcarSeccion(section.items, "ok")}
                  className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-3 py-1.5 text-xs font-black text-emerald-100"
                >
                  Todo OK
                </button>

                <button
                  type="button"
                  onClick={() => marcarSeccion(section.items, "na")}
                  className="rounded-xl border border-slate-300/30 bg-slate-400/15 px-3 py-1.5 text-xs font-black text-slate-100"
                >
                  Todo N/A
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {section.items.map(([itemId, description, obligatorio]) => {
                const current = checklist[itemId] || { estado: "", comentario: "" };
                const mostrarComentario = current.estado === "observacion";

                return (
                  <div key={itemId} className="grid gap-3 p-3 lg:grid-cols-[1fr_310px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold leading-snug text-white/85">{description}</p>
                        <span
                          className={cls(
                            "rounded-full px-2 py-0.5 text-[10px] font-black",
                            obligatorio ? "bg-red-400/15 text-red-100" : "bg-slate-400/15 text-slate-100",
                          )}
                        >
                          {obligatorio ? "OBLIGATORIO" : "SI APLICA"}
                        </span>
                      </div>

                      {mostrarComentario ? (
                        <input
                          value={current.comentario || ""}
                          onChange={(event) => setComentario(itemId, event.target.value)}
                          placeholder="Comentario de la observación..."
                          className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white outline-none placeholder:text-white/35"
                        />
                      ) : null}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <EstadoButton active={current.estado === "ok"} tone="ok" onClick={() => setEstado(itemId, "ok")}>
                        Correcto
                      </EstadoButton>
                      <EstadoButton active={current.estado === "observacion"} tone="observacion" onClick={() => setEstado(itemId, "observacion")}>
                        Observ.
                      </EstadoButton>
                      <EstadoButton
                        active={current.estado === "na"}
                        tone="na"
                        disabled={obligatorio}
                        onClick={() => setEstado(itemId, "na")}
                      >
                        N/A
                      </EstadoButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function EvidenciasPicker({ evidencias, setEvidencias }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#06122f]/60 px-4 py-5 text-center transition hover:bg-white/10">
        <Camera className="mb-2 h-7 w-7 text-white/70" />
        <span className="text-sm font-black text-white">Agregar evidencia</span>
        <span className="mt-1 text-xs font-semibold text-white/50">Fotos de calidad, estética o prueba de manejo.</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(event) => setEvidencias(Array.from(event.target.files || []))}
        />
      </label>

      {evidencias.length ? (
        <div className="mt-3 grid gap-2">
          {evidencias.map((file, index) => (
            <div key={`${file.name}-${index}`} className="truncate rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white/80">
              {file.name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [checklist, setChecklist] = useState({});
  const [evidencias, setEvidencias] = useState([]);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [ok, setOk] = useState(false);

  const errores = useMemo(() => {
    const result = {};
    if (!form.nombre.trim()) result.nombre = "Requerido";
    if (!telefonoValido(form.telefono)) result.telefono = "Teléfono inválido";
    if (!emailValido(form.correo)) result.correo = "Correo inválido";
    if (!form.fecha_hora_revision) result.fecha = "Requerido";
    if (!form.asesor_servicio) result.asesor = "Selecciona asesor";
    if (!form.tecnico_inspector.trim()) result.inspector = "Requerido";
    if (!form.orden_servicio.trim()) result.orden = "Requerido";

    if (form.requiere_prueba_manejo) {
      if (!form.fecha_prueba) result.fecha_prueba = "Requerido";
      if (!form.hora_prueba) result.hora_prueba = "Requerido";
      if (!form.kilometraje_inicial) result.kilometraje_inicial = "Requerido";
      if (!form.kilometraje_final) result.kilometraje_final = "Requerido";
      if (!form.gerente_servicio.trim()) result.gerente_servicio = "Requerido";
      if (!form.pst.trim()) result.pst = "Requerido";
    }

    return result;
  }, [form]);

  const progress = useMemo(() => {
    const ids = CHECKLIST_GENERAL
      .filter((section) => form.requiere_prueba_manejo || section.tipo !== "prueba")
      .flatMap((section) => section.items.map(([id]) => id));

    const completados = ids.filter((id) => ["ok", "observacion", "na"].includes(checklist[id]?.estado)).length;
    return { completados, total: ids.length };
  }, [checklist, form.requiere_prueba_manejo]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setOk(false);

    if (key === "requiere_prueba_manejo" && value === false) {
      setChecklist((prev) => {
        const next = { ...prev };
        PRUEBA_IDS.forEach((id) => delete next[id]);
        return next;
      });
    }
  }

  async function submit(event) {
    event.preventDefault();
    setMensaje("");
    setOk(false);

    if (Object.keys(errores).length) {
      setMensaje(Object.values(errores)[0]);
      return;
    }

    setSaving(true);

    try {
      await apiChecklistGeneral.create({
        ...form,
        telefono: normalizarTelefonoMx(form.telefono),
        checklist,
        evidencias_nuevas: evidencias,
        descripcion_evidencia: form.descripcion_evidencia,
      });

      setOk(true);
      setMensaje("Checklist general guardado correctamente.");
      setForm(FORM_INICIAL);
      setChecklist({});
      setEvidencias([]);
    } catch (error) {
      console.error(error);
      setMensaje(error.message || "No fue posible guardar el checklist general.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fondo3})` }}
        />
        <div className="absolute inset-0 bg-[#061126]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,91,187,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_28%)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-2 py-4 sm:px-4">
        <form
          onSubmit={submit}
          className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-3 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-5"
        >
          <header className="mb-4 text-center">
            <span className="inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide text-white">
              Automotriz R&amp;R · Volvo
            </span>

            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Checklist general de calidad
            </h1>

            <p className="mt-1 text-sm font-semibold text-white/60">
              Validación administrativa, técnica, prueba de manejo, estética, ANDON y entrega.
            </p>
          </header>

          {mensaje ? (
            <div
              className={cls(
                "mb-4 rounded-2xl border px-4 py-3 text-sm font-black",
                ok ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100" : "border-red-300/30 bg-red-400/15 text-red-100",
              )}
            >
              {mensaje}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-4">
              <section className="rounded-3xl border border-white/10 bg-[#06122f]/70 p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white/70">
                  <UserRound className="h-4 w-4" />
                  Datos generales
                </h2>

                <div className="grid gap-3">
                  <Field label="Dealer" icon={Building2}>
                    <Input value={form.agencia} disabled />
                  </Field>

                  <Field label="Cliente" icon={UserRound} error={errores.nombre}>
                    <Input
                      value={form.nombre}
                      error={errores.nombre}
                      onChange={(event) => setField("nombre", event.target.value.toUpperCase())}
                      placeholder="NOMBRE COMPLETO"
                    />
                  </Field>

                  <Field label="Teléfono" icon={Phone} error={errores.telefono}>
                    <Input
                      value={form.telefono}
                      error={errores.telefono}
                      onChange={(event) => setField("telefono", soloNumeros(event.target.value).slice(0, 12))}
                      inputMode="numeric"
                      placeholder="2711234567"
                    />
                  </Field>

                  <Field label="Correo" icon={Mail} error={errores.correo}>
                    <Input
                      type="email"
                      value={form.correo}
                      error={errores.correo}
                      onChange={(event) => setField("correo", event.target.value)}
                      placeholder="correo@dominio.com"
                    />
                  </Field>

                  <Field label="PST" icon={UserRound} error={errores.asesor}>
                    <Select
                      value={form.asesor_servicio}
                      error={errores.asesor}
                      onChange={(event) => setField("asesor_servicio", event.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {ASESORES_VOLVO.map((asesor) => (
                        <option key={asesor} value={asesor}>
                          {asesor}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Técnico inspector" icon={Wrench} error={errores.inspector}>
                    <Input
                      value={form.tecnico_inspector}
                      error={errores.inspector}
                      onChange={(event) => setField("tecnico_inspector", event.target.value)}
                      placeholder="Nombre técnico"
                    />
                  </Field>

                  <Field label="Fecha revisión" icon={ClipboardList} error={errores.fecha}>
                    <Input
                      type="datetime-local"
                      value={form.fecha_hora_revision}
                      error={errores.fecha}
                      onChange={(event) => setField("fecha_hora_revision", event.target.value)}
                    />
                  </Field>

                  <Field label="Orden servicio" icon={ClipboardList} error={errores.orden}>
                    <Input
                      value={form.orden_servicio}
                      error={errores.orden}
                      onChange={(event) => setField("orden_servicio", event.target.value.toUpperCase())}
                      placeholder="OS-0001"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-[#06122f]/70 p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white/70">
                  <CarFront className="h-4 w-4" />
                  Vehículo y prueba
                </h2>

                <div className="grid gap-3">
                  <Field label="Placas" icon={CarFront}>
                    <Input
                      value={form.placas}
                      onChange={(event) => setField("placas", event.target.value.toUpperCase())}
                      placeholder="ABC123"
                    />
                  </Field>

                  <Field label="VIN" icon={ClipboardList}>
                    <Input
                      value={form.vin}
                      onChange={(event) => setField("vin", event.target.value.toUpperCase())}
                      placeholder="VIN"
                    />
                  </Field>

                  <Field label="Modelo" icon={CarFront}>
                    <Input
                      value={form.modelo}
                      onChange={(event) => setField("modelo", event.target.value)}
                      placeholder="XC60"
                    />
                  </Field>

                  <Field label="Kilometraje" icon={Gauge}>
                    <Input
                      value={form.kilometraje}
                      onChange={(event) => setField("kilometraje", soloNumeros(event.target.value))}
                      inputMode="numeric"
                      placeholder="35000"
                    />
                  </Field>

                  <Field label="¿Requiere prueba?" icon={Route}>
                    <div className="grid h-11 grid-cols-2 rounded-xl border border-white/10 bg-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => setField("requiere_prueba_manejo", true)}
                        className={cls(
                          "rounded-lg text-sm font-black transition",
                          form.requiere_prueba_manejo ? "bg-white text-[#212721]" : "text-white/65 hover:bg-white/10",
                        )}
                      >
                        Sí
                      </button>

                      <button
                        type="button"
                        onClick={() => setField("requiere_prueba_manejo", false)}
                        className={cls(
                          "rounded-lg text-sm font-black transition",
                          !form.requiere_prueba_manejo ? "bg-white text-[#212721]" : "text-white/65 hover:bg-white/10",
                        )}
                      >
                        No
                      </button>
                    </div>
                  </Field>

                  {form.requiere_prueba_manejo ? (
                    <>
                      <Field label="Fecha prueba" icon={Route} error={errores.fecha_prueba}>
                        <Input
                          type="date"
                          value={form.fecha_prueba}
                          error={errores.fecha_prueba}
                          onChange={(event) => setField("fecha_prueba", event.target.value)}
                        />
                      </Field>

                      <Field label="Hora prueba" icon={Route} error={errores.hora_prueba}>
                        <Input
                          type="time"
                          value={form.hora_prueba}
                          error={errores.hora_prueba}
                          onChange={(event) => setField("hora_prueba", event.target.value)}
                        />
                      </Field>

                      <Field label="KM inicial" icon={Gauge} error={errores.kilometraje_inicial}>
                        <Input
                          value={form.kilometraje_inicial}
                          error={errores.kilometraje_inicial}
                          onChange={(event) => setField("kilometraje_inicial", soloNumeros(event.target.value))}
                          inputMode="numeric"
                          placeholder="35000"
                        />
                      </Field>

                      <Field label="KM final" icon={Gauge} error={errores.kilometraje_final}>
                        <Input
                          value={form.kilometraje_final}
                          error={errores.kilometraje_final}
                          onChange={(event) => setField("kilometraje_final", soloNumeros(event.target.value))}
                          inputMode="numeric"
                          placeholder="35010"
                        />
                      </Field>

                      <Field label="Gerente servicio" icon={UserCheck} error={errores.gerente_servicio}>
                        <Input
                          value={form.gerente_servicio}
                          error={errores.gerente_servicio}
                          onChange={(event) => setField("gerente_servicio", event.target.value)}
                          placeholder="Nombre gerente"
                        />
                      </Field>

                      <Field label="PST" icon={UserCheck} error={errores.pst}>
                        <Input
                          value={form.pst}
                          error={errores.pst}
                          onChange={(event) => setField("pst", event.target.value)}
                          placeholder="Nombre PST"
                        />
                      </Field>
                    </>
                  ) : null}

                  <Field label="Descripción evidencia" icon={Camera}>
                    <Input
                      value={form.descripcion_evidencia}
                      onChange={(event) => setField("descripcion_evidencia", event.target.value)}
                      placeholder="Ej. prueba de manejo"
                    />
                  </Field>

                  <Field label="Observaciones" icon={MessageSquareText}>
                    <Textarea
                      value={form.observaciones}
                      onChange={(event) => setField("observaciones", event.target.value)}
                      placeholder="Comentarios generales de calidad..."
                    />
                  </Field>

                  <EvidenciasPicker evidencias={evidencias} setEvidencias={setEvidencias} />
                </div>
              </section>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-[#06122f]/70 p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white/70">
                  <ClipboardList className="h-4 w-4" />
                  Checklist general
                </h2>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#212721]">
                  {progress.completados}/{progress.total} completados
                </span>
              </div>

              <ChecklistCard
                checklist={checklist}
                onChange={setChecklist}
                requierePrueba={form.requiere_prueba_manejo}
              />
            </section>
          </div>

          <div className="sticky bottom-2 mt-4 rounded-2xl border border-white/10 bg-[#06122f]/90 p-3 backdrop-blur-xl">
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#212721] transition hover:bg-white/90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Guardando..." : "Guardar checklist general"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}