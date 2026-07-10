import React, { useState, useMemo } from 'react';
import { BarChart3, BookOpen, MapPin, Target, ChevronRight, Award, Briefcase, FileText, Map, Filter, XCircle } from 'lucide-react';

// --- DADOS DO EDITAL ---

const PROFILES = [
  { id: 1, name: "Perfil 1: Análise de Negócios de TI" },
  { id: 2, name: "Perfil 2: Arquitetura, Engenharia e Sustentação Tecnológica" },
  { id: 3, name: "Perfil 3: Desenvolvimento de Software" },
  { id: 4, name: "Perfil 4: Inteligência da Informação" },
  { id: 5, name: "Perfil 5: Segurança Cibernética e Proteção de Dados" },
  { id: 6, name: "Perfil 6: Gestão de Serviços de TIC" },
  { id: 13, name: "Perfil 13: Analista de Processamento" }
];

const SCORING = {
  moduloI: [
    { disciplina: "Língua Portuguesa", questoes: 12, peso: 1, maximo: 12 },
    { disciplina: "Língua Inglesa", questoes: 12, peso: 1, maximo: 12 },
    { disciplina: "Raciocínio Lógico Matemático", questoes: 5, peso: 1, maximo: 5 },
    { disciplina: "Atualidades e Inteligência Artificial", questoes: 6, peso: 1, maximo: 6 },
    { disciplina: "Segurança da Inf. e Proteção de Dados", questoes: 5, peso: 1, maximo: 5 },
  ],
  moduloII: [
    { disciplina: "Conhecimentos Específicos", questoes: 30, peso: 2.5, maximo: 75 }
  ]
};

const SYLLABUS_GENERAL = [
  { title: "Língua Portuguesa", content: "Compreensão e interpretação de textos. Tipos e gêneros textuais. Ortografia oficial. Coesão textual. Estrutura morfossintática do período. Reescrita de frases e parágrafos." },
  { title: "Língua Inglesa", content: "Compreensão de textos em língua inglesa e itens gramaticais relevantes para o entendimento dos sentidos dos textos." },
  { title: "Raciocínio Lógico", content: "Estruturas lógicas. Lógica de argumentação. Lógica sentencial (proposicional). Lógica de primeira ordem. Problemas aritméticos, geométricos e matriciais." },
  { title: "Atualidades e IA", content: "Tópicos relevantes e atuais (segurança, transportes, política, etc). Inteligência Artificial: fundamentos, aprendizado de máquina, modelos generativos, ética e governança em IA." },
  { title: "Legislação (Segurança e Dados)", content: "Lei de Acesso à Informação (12.527/11). Lei de Delitos Informáticos (12.737/12). Marco Civil da Internet (12.965/14). LGPD (13.709/18)." }
];

const SYLLABUS_SPECIFIC = {
  1: ["Análise de negócios", "Gestão por processos e gestão funcional (PDCA)", "BPM CBOK v.4.0 (Notação BPMN, BPMS)", "Gestão Ágil de Projetos e Produtos", "COBIT 2019 e ITIL v4", "Engenharia de software e Requisitos", "User experience (UX), Storytelling, Prototipação, MVP", "Arquitetura de Dados (Relacional, NoSQL, SQL)", "Análise de dados (BI, Data Warehouse, OLAP)", "Negociação e Comunicação Assertiva"],
  2: ["Redes de Computadores (OSI, TCP/IP)", "Banco de Dados (Relacional, NoSQL, Big Data)", "Arquitetura Tecnológica (Engenharia de Software, Ágil, SOLID, Padrões)", "Computação em Nuvem e Virtualização (AWS, Azure, Docker, Kubernetes, VMware)", "Linguagens: Java, React, Spring Boot", "Segurança da Informação e LGPD", "Plataforma Básica e Automação (DevOps, CI/CD, Linux)", "Ferramentas Analytics (ETL, Hadoop)", "Plataforma Baixa e Aplicações (Servidores WEB, Jboss)"],
  3: ["Desenvolvimento de Sistemas (Java, Spring, React, Angular, Vue)", "Arquitetura de Software (Microsserviços, API REST, SOA)", "Testes (TDD, Unitários, Automatizados)", "Metodologias Ágeis (Scrum, Kanban)", "Engenharia de Requisitos", "Inteligência de Negócios (BI)", "Segurança da Informação (OWASP, SDL, Criptografia)", "Banco de Dados (SQL, NoSQL, Modelagem)", "Gestão e Governança de TI (ITIL, COBIT)"],
  4: ["Matemática (Cálculo, Álgebra Linear)", "Estatística Aplicada (Probabilidade, Inferência)", "Ciência de Dados (Machine Learning Supervisionado e Não-Supervisionado)", "Redes Neurais, Deep Learning e PLN", "Linguagens de Programação (Python: Pandas, TensorFlow, Pytorch; R)", "Hadoop e Spark", "Banco de Dados e Modelagem"],
  5: ["Redes de Computadores", "Segurança da Informação (ISO 27001/27002)", "Criptografia e Certificação Digital", "Gestão de Riscos e Continuidade de Negócios", "Operação de Segurança (SIEM, Firewall, IPS, WAF)", "Testes de Penetração e Threat Hunting", "Gestão e Governança de TI", "Computação em Nuvem"],
  6: ["Gestão e Governança de TI (PMBOK 7, ITIL v4, COBIT 2019, BPMN)", "Instruções Normativas (SGD 1/2019, 05/2021, 94/2022)", "Suporte e Infraestrutura (Storage, SAN, Virtualização VMWare/HyperV)", "Nuvem Pública e Privada", "Banco de Dados (SQL e NoSQL)", "Redes de Computadores"],
  13: ["Segurança da Informação", "Gestão de Servidores (Windows Server, Linux Red Hat/Debian)", "Active Directory e LDAP", "Computação em Nuvem e Virtualização", "Redes de Computadores (TCP/IP, Telefonia IP, VoIP)", "Banco de Dados", "Inteligência de Negócios", "Gestão e Governança de TI (ITIL, COBIT)"]
};

const VACANCIES = [
  // PERFIL 1
  { profile: 1, loc: "Brasília / DF", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 32, cr_pcd: 2, cr_pp: 13, cr_total: 50, total: 55 },
  { profile: 1, loc: "Rio de Janeiro / RJ", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 1, loc: "São Paulo / SP", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 1, loc: "Fortaleza / CE", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 1, loc: "João Pessoa / PB", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 1, loc: "Natal / RN", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 1, loc: "Florianópolis / SC", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  // PERFIL 2
  { profile: 2, loc: "Brasília / DF", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 2, loc: "Rio de Janeiro / RJ", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 2, loc: "São Paulo / SP", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 2, loc: "Fortaleza / CE", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 5, cr_pcd: 1, cr_pp: 3, cr_total: 9, total: 9 },
  { profile: 2, loc: "João Pessoa / PB", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 5, cr_pcd: 1, cr_pp: 3, cr_total: 9, total: 9 },
  { profile: 2, loc: "Natal / RN", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 5, cr_pcd: 1, cr_pp: 3, cr_total: 9, total: 9 },
  { profile: 2, loc: "Florianópolis / SC", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 5, cr_pcd: 1, cr_pp: 3, cr_total: 9, total: 9 },
  // PERFIL 3
  { profile: 3, loc: "Brasília / DF", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 11, cr_pcd: 1, cr_pp: 4, cr_total: 17, total: 17 },
  { profile: 3, loc: "Rio de Janeiro / RJ", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 11, cr_pcd: 1, cr_pp: 4, cr_total: 17, total: 17 },
  { profile: 3, loc: "São Paulo / SP", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 11, cr_pcd: 1, cr_pp: 4, cr_total: 17, total: 17 },
  { profile: 3, loc: "Fortaleza / CE", imm_ac: 13, imm_pcd: 1, imm_pp: 5, imm_total: 20, cr_ac: 52, cr_pcd: 4, cr_pp: 20, cr_total: 80, total: 100 },
  { profile: 3, loc: "João Pessoa / PB", imm_ac: 13, imm_pcd: 1, imm_pp: 5, imm_total: 20, cr_ac: 52, cr_pcd: 4, cr_pp: 20, cr_total: 80, total: 100 },
  { profile: 3, loc: "Natal / RN", imm_ac: 13, imm_pcd: 1, imm_pp: 5, imm_total: 20, cr_ac: 52, cr_pcd: 4, cr_pp: 20, cr_total: 80, total: 100 },
  { profile: 3, loc: "Florianópolis / SC", imm_ac: 13, imm_pcd: 1, imm_pp: 5, imm_total: 20, cr_ac: 52, cr_pcd: 4, cr_pp: 20, cr_total: 80, total: 100 },
  // PERFIL 4
  { profile: 4, loc: "Brasília / DF", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 15, cr_pcd: 1, cr_pp: 6, cr_total: 24, total: 29 },
  { profile: 4, loc: "Rio de Janeiro / RJ", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 15, cr_pcd: 2, cr_pp: 6, cr_total: 25, total: 25 },
  { profile: 4, loc: "São Paulo / SP", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 2, cr_total: 9, total: 9 },
  { profile: 4, loc: "Fortaleza / CE", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 4, loc: "João Pessoa / PB", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 4, loc: "Natal / RN", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  { profile: 4, loc: "Florianópolis / SC", imm_ac: 6, imm_pcd: 1, imm_pp: 3, imm_total: 10, cr_ac: 32, cr_pcd: 2, cr_pp: 12, cr_total: 49, total: 59 },
  // PERFIL 5
  { profile: 5, loc: "Brasília / DF", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 12, cr_pcd: 1, cr_pp: 5, cr_total: 20, total: 25 },
  { profile: 5, loc: "Rio de Janeiro / RJ", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 12, cr_pcd: 1, cr_pp: 5, cr_total: 20, total: 25 },
  { profile: 5, loc: "São Paulo / SP", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 12, cr_pcd: 1, cr_pp: 5, cr_total: 20, total: 25 },
  { profile: 5, loc: "Fortaleza / CE", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 3, cr_pcd: 1, cr_pp: 1, cr_total: 5, total: 5 },
  { profile: 5, loc: "João Pessoa / PB", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 11, cr_pcd: 1, cr_pp: 4, cr_total: 17, total: 17 },
  { profile: 5, loc: "Natal / RN", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 3, cr_pcd: 1, cr_pp: 1, cr_total: 5, total: 5 },
  { profile: 5, loc: "Florianópolis / SC", imm_ac: 1, imm_pcd: 1, imm_pp: 0, imm_total: 2, cr_ac: 10, cr_pcd: 0, cr_pp: 4, cr_total: 15, total: 17 },
  // PERFIL 6
  { profile: 6, loc: "Brasília / DF", imm_ac: 3, imm_pcd: 1, imm_pp: 1, imm_total: 5, cr_ac: 28, cr_pcd: 2, cr_pp: 11, cr_total: 44, total: 49 },
  { profile: 6, loc: "Rio de Janeiro / RJ", imm_ac: 10, imm_pcd: 1, imm_pp: 4, imm_total: 15, cr_ac: 38, cr_pcd: 3, cr_pp: 15, cr_total: 60, total: 75 },
  { profile: 6, loc: "São Paulo / SP", imm_ac: 10, imm_pcd: 1, imm_pp: 4, imm_total: 15, cr_ac: 38, cr_pcd: 3, cr_pp: 15, cr_total: 60, total: 75 },
  // PERFIL 13
  { profile: 13, loc: "Brasília / DF", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 3, cr_total: 10, total: 10 },
  { profile: 13, loc: "Rio de Janeiro / RJ", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 3, cr_total: 10, total: 10 },
  { profile: 13, loc: "São Paulo / SP", imm_ac: 0, imm_pcd: 0, imm_pp: 0, imm_total: 0, cr_ac: 6, cr_pcd: 1, cr_pp: 3, cr_total: 10, total: 10 },
];

// Mapa em blocos do Brasil (Tile Map)
const BRAZIL_TILES = [
  [null, 'RR', 'AP', null, null, null],
  ['AM', 'PA', 'MA', 'CE', 'RN', null],
  ['AC', 'RO', 'MT', 'TO', 'PI', 'PB'],
  [null, null, 'GO', 'BA', 'PE', null],
  [null, 'MS', 'DF', 'MG', 'AL', null],
  [null, null, 'SP', 'RJ', 'SE', null],
  [null, null, 'PR', 'ES', null, null],
  [null, null, 'SC', null, null, null],
  [null, null, 'RS', null, null, null],
];

export default function App() {
  const [activeTab, setActiveTab] = useState('vagas'); // Mudado padrão para 'vagas' para demonstrar a feature
  const [contentProfile, setContentProfile] = useState(1);
  
  // Estados separados para os filtros da aba de Vagas
  const [filterProfile, setFilterProfile] = useState('all');
  const [filterUF, setFilterUF] = useState('all');

  // Obter UFs únicas com vagas disponíveis
  const allAvailableUFs = useMemo(() => {
    const ufs = VACANCIES.map(v => v.loc.split(' / ')[1]);
    return Array.from(new Set(ufs)).sort();
  }, []);

  // Determinar quais estados têm vagas para o perfil atualmente selecionado (para colorir o mapa)
  // IMPORTANTE: Hooks do React não podem ficar em funções condicionais como renderVagas()
  const activeStatesForProfile = useMemo(() => {
    const states = VACANCIES
      .filter(v => filterProfile === 'all' || v.profile === Number(filterProfile))
      .map(v => v.loc.split(' / ')[1]);
    return new Set(states);
  }, [filterProfile]);

  const renderPontuacao = () => {
    const totalMaxI = SCORING.moduloI.reduce((acc, curr) => acc + curr.maximo, 0);
    const totalMaxII = SCORING.moduloII.reduce((acc, curr) => acc + curr.maximo, 0);
    const grandTotal = totalMaxI + totalMaxII;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Questões</p>
              <h2 className="text-4xl font-bold">70</h2>
            </div>
            <Target className="w-10 h-10 text-blue-200 opacity-80" />
          </div>
          <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Pontuação Máxima</p>
              <h2 className="text-4xl font-bold">{grandTotal} <span className="text-xl font-normal">pts</span></h2>
            </div>
            <Award className="w-10 h-10 text-indigo-200 opacity-80" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <p className="text-gray-500 text-sm font-medium mb-2">Peso Relativo na Prova</p>
            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
              <div style={{ width: `${(totalMaxI / grandTotal) * 100}%` }} className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" title="Conhecimentos Gerais">
                {Math.round((totalMaxI / grandTotal) * 100)}%
              </div>
              <div style={{ width: `${(totalMaxII / grandTotal) * 100}%` }} className="bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold" title="Conhecimentos Específicos">
                {Math.round((totalMaxII / grandTotal) * 100)}%
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gerais</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Específicos (Peso 2,5)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Módulo I - Conhecimentos Gerais
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Disciplina</th>
                    <th className="px-4 py-3 text-center">Questões</th>
                    <th className="px-4 py-3 text-center">Peso</th>
                    <th className="px-4 py-3 text-center">Máx.</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING.moduloI.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.disciplina}</td>
                      <td className="px-4 py-4 text-center">{item.questoes}</td>
                      <td className="px-4 py-4 text-center">{item.peso}</td>
                      <td className="px-4 py-4 text-center font-bold text-blue-600">{item.maximo}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold text-gray-800">
                    <td className="px-6 py-4 text-right uppercase text-xs">Total Módulo I</td>
                    <td className="px-4 py-4 text-center">40</td>
                    <td className="px-4 py-4 text-center">-</td>
                    <td className="px-4 py-4 text-center text-blue-700">{totalMaxI}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Módulo II - Conhecimentos Específicos
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Disciplina</th>
                    <th className="px-4 py-3 text-center">Questões</th>
                    <th className="px-4 py-3 text-center">Peso</th>
                    <th className="px-4 py-3 text-center">Máx.</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING.moduloII.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.disciplina}</td>
                      <td className="px-4 py-4 text-center">{item.questoes}</td>
                      <td className="px-4 py-4 text-center text-red-500 font-bold">{item.peso}</td>
                      <td className="px-4 py-4 text-center font-bold text-indigo-600">{item.maximo}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-100 font-bold text-indigo-900">
                    <td className="px-6 py-4 text-right uppercase text-xs">Total Módulo II</td>
                    <td className="px-4 py-4 text-center">30</td>
                    <td className="px-4 py-4 text-center">-</td>
                    <td className="px-4 py-4 text-center text-indigo-700">{totalMaxII}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-white">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm text-amber-800">
                <strong className="block mb-1">Estratégia:</strong>
                As questões de Conhecimentos Específicos valem <strong>2,5 vezes mais</strong> que as de Gerais. Elas representam ~65% da sua nota final, apesar de serem menos questões.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVagas = () => {
    // 1. Filtragem da Tabela
    const filteredVacancies = VACANCIES.filter(v => {
      const uf = v.loc.split(' / ')[1];
      const matchProfile = filterProfile === 'all' || v.profile === Number(filterProfile);
      const matchUF = filterUF === 'all' || uf === filterUF;
      return matchProfile && matchUF;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Painel de Filtros e Mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna da Esquerda: Filtros e Mapa */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filtros de Vagas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cargo / Perfil</label>
                  <select 
                    value={filterProfile}
                    onChange={(e) => setFilterProfile(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  >
                    <option value="all">Todos os Cargos</option>
                    {PROFILES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cidade / Estado</label>
                  <select 
                    value={filterUF}
                    onChange={(e) => setFilterUF(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  >
                    <option value="all">Todas as Localidades</option>
                    {allAvailableUFs.map(uf => <option key={uf} value={uf}>{uf} (Estado)</option>)}
                  </select>
                </div>

                {(filterProfile !== 'all' || filterUF !== 'all') && (
                  <button 
                    onClick={() => { setFilterProfile('all'); setFilterUF('all'); }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-emerald-600" />
                Mapa de Vagas
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Estados em <span className="text-blue-600 font-bold">azul</span> possuem vagas para o filtro atual. Clique para filtrar pela localidade.
              </p>

              <div className="grid grid-cols-6 gap-1.5 w-fit mx-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
                {BRAZIL_TILES.map((row, rowIndex) => (
                  row.map((uf, colIndex) => {
                    if (!uf) return <div key={`empty-${rowIndex}-${colIndex}`} className="w-8 h-8 md:w-10 md:h-10" />;
                    
                    const hasVacancy = activeStatesForProfile.has(uf);
                    const isSelected = filterUF === uf;

                    return (
                      <button
                        key={uf}
                        onClick={() => setFilterUF(isSelected ? 'all' : uf)}
                        disabled={!hasVacancy && filterUF === 'all'}
                        title={hasVacancy ? `Filtrar por ${uf}` : `Sem vagas em ${uf}`}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded text-xs font-bold transition-all duration-200
                          ${isSelected 
                            ? 'bg-blue-600 text-white shadow-lg scale-110 ring-2 ring-blue-300 z-10' 
                            : hasVacancy 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer hover:scale-105' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-40'}
                        `}
                      >
                        {uf}
                      </button>
                    );
                  })
                ))}
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Tabela de Vagas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-800 text-white uppercase text-xs">
                      {filterProfile === 'all' && <th className="px-4 py-4 rounded-tl-lg" rowSpan="2">Cargo</th>}
                      <th className={`px-4 py-4 ${filterProfile !== 'all' ? 'rounded-tl-lg' : ''}`} rowSpan="2">Localidade</th>
                      <th className="px-3 py-2 text-center border-l border-gray-600 bg-blue-900" colSpan="4">Vagas Imediatas</th>
                      <th className="px-3 py-2 text-center border-l border-gray-600 bg-indigo-900" colSpan="4">Cadastro de Reserva (CR)</th>
                      <th className="px-4 py-4 text-center border-l border-gray-600 bg-emerald-700 rounded-tr-lg" rowSpan="2">TOTAL GERAL</th>
                    </tr>
                    <tr className="bg-gray-700 text-gray-200 text-xs">
                      <th className="px-1.5 py-2 text-center border-l border-gray-600">AC</th>
                      <th className="px-1.5 py-2 text-center">PCD</th>
                      <th className="px-1.5 py-2 text-center">PP</th>
                      <th className="px-1.5 py-2 text-center font-bold bg-blue-800">Tot</th>
                      
                      <th className="px-1.5 py-2 text-center border-l border-gray-600">AC</th>
                      <th className="px-1.5 py-2 text-center">PCD</th>
                      <th className="px-1.5 py-2 text-center">PP</th>
                      <th className="px-1.5 py-2 text-center font-bold bg-indigo-800">Tot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVacancies.length > 0 ? filteredVacancies.map((v, idx) => {
                      const profileData = PROFILES.find(p => p.id === v.profile);
                      const profileNameSplit = profileData.name.split(': ');

                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          {filterProfile === 'all' && (
                            <td className="px-4 py-3 border-r border-gray-100">
                              <div className="text-xs font-bold text-blue-700">{profileNameSplit[0]}</div>
                              <div className="text-[11px] text-gray-500 w-32 truncate" title={profileNameSplit[1]}>
                                {profileNameSplit[1]}
                              </div>
                            </td>
                          )}
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {v.loc}
                            </div>
                          </td>
                          <td className="px-1.5 py-3 text-center border-l border-gray-100 text-gray-600">{v.imm_ac}</td>
                          <td className="px-1.5 py-3 text-center text-gray-600">{v.imm_pcd}</td>
                          <td className="px-1.5 py-3 text-center text-gray-600">{v.imm_pp}</td>
                          <td className="px-1.5 py-3 text-center font-bold text-blue-700 bg-blue-50/50">{v.imm_total}</td>
                          
                          <td className="px-1.5 py-3 text-center border-l border-gray-100 text-gray-600">{v.cr_ac}</td>
                          <td className="px-1.5 py-3 text-center text-gray-600">{v.cr_pcd}</td>
                          <td className="px-1.5 py-3 text-center text-gray-600">{v.cr_pp}</td>
                          <td className="px-1.5 py-3 text-center font-bold text-indigo-700 bg-indigo-50/50">{v.cr_total}</td>
                          
                          <td className="px-4 py-3 text-center font-bold text-base text-emerald-600 border-l border-gray-100 bg-emerald-50/30">{v.total}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={filterProfile === 'all' ? 11 : 10} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <XCircle className="w-8 h-8 text-gray-300" />
                            <p>Nenhuma vaga encontrada para esta combinação de filtros.</p>
                            <button onClick={() => {setFilterProfile('all'); setFilterUF('all')}} className="text-blue-600 hover:underline mt-2">Limpar filtros</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderConteudo = () => {
    const specificTopics = SYLLABUS_SPECIFIC[contentProfile] || [];
    
    return (
      <div className="space-y-6 animate-fade-in">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mostrar conteúdo específico para o Cargo/Perfil:</label>
          <select 
            value={contentProfile}
            onChange={(e) => setContentProfile(Number(e.target.value))}
            className="w-full md:w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
          >
            {PROFILES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gerais */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-600" /> 
              Módulo I - Comum a Todos
            </h3>
            <div className="space-y-3">
              {SYLLABUS_GENERAL.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed pl-6">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Específicos */}
          <div>
             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="text-indigo-600" /> 
              Módulo II - Específico (Peso 2.5x)
            </h3>
            <div className="bg-indigo-50/50 p-1 rounded-xl border border-indigo-100">
              <div className="bg-white rounded-lg p-5">
                <h4 className="font-bold text-indigo-900 mb-4 pb-2 border-b border-gray-100">
                  {PROFILES.find(p => p.id === contentProfile)?.name}
                </h4>
                <ul className="space-y-3">
                  {specificTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="mt-0.5 bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Edital <span className="text-blue-600">DataPrev 2026</span>
            </h1>
            <p className="text-gray-500 mt-1">Análise estratégica de pesos, vagas e disciplinas.</p>
          </div>
          <div className="flex gap-2 bg-blue-50 p-2 rounded-lg text-sm text-blue-800 font-medium border border-blue-100">
            <Briefcase className="w-5 h-5" />
            Concurso Público
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 p-1 gap-1">
          <button 
            onClick={() => setActiveTab('pontuacao')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pontuacao' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Estrutura e Pesos
          </button>
          <button 
            onClick={() => setActiveTab('vagas')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'vagas' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MapPin className="w-4 h-4" />
            Quadro de Vagas
          </button>
          <button 
            onClick={() => setActiveTab('conteudo')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'conteudo' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="w-4 h-4" />
            Conteúdo Programático
          </button>
        </div>

        {/* Main Content Area */}
        <main>
          {activeTab === 'pontuacao' && renderPontuacao()}
          {activeTab === 'vagas' && renderVagas()}
          {activeTab === 'conteudo' && renderConteudo()}
        </main>

        <footer className="text-center text-sm text-gray-400 py-8">
          Criado para análise do Edital DataPrev. Os dados de Vagas incluem AC (Ampla Concorrência), PCD e PP (Pessoas Pretas/Pardas). As cotas PI e PQ foram omitidas na visualização por serem 0 ou irrelevantes na maioria para simplificar a tabela, mas estão computadas no Total.
        </footer>
      </div>
    </div>
  );
}