import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Globe, 
  Key, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight, 
  Play, 
  ExternalLink,
  ShieldCheck,
  FileCode2,
  Workflow
} from 'lucide-react';

export const ProjectGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'setup' | 'workflow' | 'troubleshooting'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appPropertiesCode = `# Spring Boot Configuration (src/main/resources/application.properties)
server.port=8080

# Database Configuration (PostgreSQL per pom.xml)
spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Optional MySQL alternative (if using MySQL as in README):
# spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db?useSSL=false&serverTimezone=UTC
# spring.datasource.username=root
# spring.datasource.password=root
# spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect`;

  const runCommands = `# 1. Clone or open the repository root
cd inventory

# 2. Ensure Java 21 is installed
java -version

# 3. Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE inventory_db;"

# 4. Run the Spring Boot backend with Maven Wrapper:
# On Linux / macOS:
./mvnw spring-boot:run

# On Windows:
mvnw.cmd spring-boot:run

# 5. The server will start at: http://localhost:8080`;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Hero / Header */}
      <div className="bg-gradient-to-r from-[#13161e] via-[#1a1e28] to-[#13161e] border border-[#2a2f3f] rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3a3]/10 border border-[#22d3a3]/30 text-[#22d3a3] font-mono text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5" />
            Complete Project Operational Manual
          </div>
          <h1 className="font-head text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            How This Inventory Project Works in Current Time
          </h1>
          <p className="text-sm lg:text-base text-[#8b92ab] max-w-3xl leading-relaxed">
            A comprehensive breakdown of your full-stack architecture: how the frontend views communicate with Java Spring Boot 3.5+, how low-stock detection operates, how database persistence works, and step-by-step instructions to run it locally.
          </p>

          {/* Guide Sub-navigation */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_15px_rgba(92,110,248,0.4)]'
                  : 'bg-[#13161e] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#1a1e28]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              1. System Architecture
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'setup'
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_15px_rgba(92,110,248,0.4)]'
                  : 'bg-[#13161e] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#1a1e28]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              2. How to Run Locally
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'workflow'
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_15px_rgba(92,110,248,0.4)]'
                  : 'bg-[#13161e] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#1a1e28]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              3. Data &amp; Event Workflow
            </button>

            <button
              onClick={() => setActiveTab('troubleshooting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'troubleshooting'
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_15px_rgba(92,110,248,0.4)]'
                  : 'bg-[#13161e] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#1a1e28]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              4. Common Pitfalls &amp; CORS
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Visual Architecture Diagram */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6">
            <h3 className="font-head text-base font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5c6ef8]" />
              Official System Architecture (Figure 3.1)
            </h3>

            {/* Embedded Figure 3.1 from user report */}
            <div className="mb-6 rounded-xl overflow-hidden border border-[#2a2f3f] bg-white p-3 shadow-md">
              <img
                src="/public/assets/aistudio/image_f6abf95c.png"
                alt="Figure 3.1: System Architecture of the Inventory Management System"
                className="w-full max-h-[420px] object-contain mx-auto"
              />
              <p className="text-center text-[11px] font-serif text-[#333] mt-2 font-medium">
                Figure 3.1: System Architecture of the Inventory Management System
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Frontend Layer */}
              <div className="bg-[#1a1e28] border border-[#2a2f3f] rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-[#7b8aff] font-bold px-2 py-0.5 rounded bg-[#5c6ef8]/15 border border-[#5c6ef8]/30">
                    Client Tier
                  </span>
                  <Globe className="w-4 h-4 text-[#7b8aff]" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">Frontend SPA / UI</h4>
                <p className="text-xs text-[#8b92ab] mb-3">
                  HTML5, Modern CSS variables, vanilla JavaScript (<code className="text-white">script.js</code>) or React 19 client.
                </p>
                <ul className="text-[11px] text-[#8b92ab] space-y-1.5 font-mono">
                  <li>• <strong className="text-white">index.html:</strong> Dashboard &amp; Products</li>
                  <li>• <strong className="text-white">login.html:</strong> Auth session</li>
                  <li>• <strong className="text-white">localStorage:</strong> User token cache</li>
                  <li>• <strong className="text-white">fetch API:</strong> Calls <code className="text-[#22d3a3]">http://localhost:8080</code></li>
                </ul>
              </div>

              {/* Box 2: Spring Boot Backend */}
              <div className="bg-[#1a1e28] border border-[#2a2f3f] rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-[#22d3a3] font-bold px-2 py-0.5 rounded bg-[#22d3a3]/15 border border-[#22d3a3]/30">
                    Application Tier
                  </span>
                  <Cpu className="w-4 h-4 text-[#22d3a3]" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">Spring Boot 3.5.x (Java 21)</h4>
                <p className="text-xs text-[#8b92ab] mb-3">
                  RESTful controllers, Spring Data JPA services, BCrypt auth, and business logic.
                </p>
                <ul className="text-[11px] text-[#8b92ab] space-y-1.5 font-mono">
                  <li>• <strong className="text-white">AuthController:</strong> /auth/register, /login</li>
                  <li>• <strong className="text-white">ProductController:</strong> CRUD /products</li>
                  <li>• <strong className="text-white">StockHistory:</strong> Audit event logging</li>
                  <li>• <strong className="text-white">Spring Validation:</strong> @Valid, @NotBlank</li>
                </ul>
              </div>

              {/* Box 3: Database Tier */}
              <div className="bg-[#1a1e28] border border-[#2a2f3f] rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-[#f5a623] font-bold px-2 py-0.5 rounded bg-[#f5a623]/15 border border-[#f5a623]/30">
                    Data Tier
                  </span>
                  <Database className="w-4 h-4 text-[#f5a623]" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">PostgreSQL / MySQL</h4>
                <p className="text-xs text-[#8b92ab] mb-3">
                  Relational storage managed via Hibernate ORM (<code className="text-white">ddl-auto=update</code>).
                </p>
                <ul className="text-[11px] text-[#8b92ab] space-y-1.5 font-mono">
                  <li>• <strong className="text-white">users:</strong> id, username, password_hash</li>
                  <li>• <strong className="text-white">products:</strong> name, price, qty, status</li>
                  <li>• <strong className="text-white">stock_history:</strong> audit trail</li>
                  <li>• <strong className="text-white">ACID transactions:</strong> @Transactional</li>
                </ul>
              </div>

            </div>

            {/* Connecting arrows indicator */}
            <div className="mt-4 p-3 rounded-xl bg-[#0d0f14] border border-[#2a2f3f] flex items-center justify-center gap-3 text-xs font-mono text-[#8b92ab]">
              <span>Browser (HTTP / JSON)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5c6ef8]" />
              <span>Spring Boot REST (Port 8080)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22d3a3]" />
              <span>Hibernate / PostgreSQL (Port 5432)</span>
            </div>
          </div>

          {/* Files Breakdown Table */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6">
            <h3 className="font-head text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-[#7b8aff]" />
              Codebase File Responsibilities
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1a1e28] text-[#8b92ab] font-mono uppercase text-[11px]">
                    <th className="py-2.5 px-3">File / Asset</th>
                    <th className="py-2.5 px-3">Role &amp; Technology</th>
                    <th className="py-2.5 px-3">Key Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2f3f]">
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">index.html</td>
                    <td className="py-3 px-3 text-[#8b92ab]">Main Application Layout</td>
                    <td className="py-3 px-3 text-white">Three views: Dashboard, Products Table, Stock History. Add/Edit &amp; Delete modals.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">script.js</td>
                    <td className="py-3 px-3 text-[#8b92ab]">Frontend Business Logic</td>
                    <td className="py-3 px-3 text-white">REST API calls to localhost:8080, table rendering, search, category filter, client-side pagination, CSV export.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">styles.css</td>
                    <td className="py-3 px-3 text-[#8b92ab]">CSS Custom Design System</td>
                    <td className="py-3 px-3 text-white">Cyber dark palette (#0d0f14), Syne &amp; Outfit fonts, custom badges, toast notifications, responsive grid.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">login.html &amp; register.html</td>
                    <td className="py-3 px-3 text-[#8b92ab]">Authentication UI</td>
                    <td className="py-3 px-3 text-white">Sends credentials to /auth/login and /auth/register, sets <code className="text-[#22d3a3]">localStorage.setItem(&quot;user&quot;, username)</code>.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">pom.xml</td>
                    <td className="py-3 px-3 text-[#8b92ab]">Maven Dependencies</td>
                    <td className="py-3 px-3 text-white">Spring Boot 3.5.13, Java 21, Spring Data JPA, Spring Web, Validation, PostgreSQL runtime, Lombok, Spring Security Crypto.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-white">mvnw / mvnw.cmd</td>
                    <td className="py-3 px-3 text-[#8b92ab]">Maven Wrapper</td>
                    <td className="py-3 px-3 text-white">Allows building and running the Spring Boot backend on any machine without pre-installing Maven.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: HOW TO RUN LOCALLY */}
      {activeTab === 'setup' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Step 1: Requirements */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6">
            <h3 className="font-head text-base font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22d3a3]" />
              Prerequisites for Running Currently
            </h3>
            <p className="text-xs text-[#8b92ab] mb-4">
              To run this project on your computer or cloud server in 2026, ensure the following are installed:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f]">
                <div className="font-mono text-xs font-bold text-white">1. JDK 21+</div>
                <p className="text-[11px] text-[#8b92ab] mt-1">OpenJdk 21 or Eclipse Temurin (per &lt;java.version&gt;21 in pom.xml).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f]">
                <div className="font-mono text-xs font-bold text-white">2. PostgreSQL or MySQL</div>
                <p className="text-[11px] text-[#8b92ab] mt-1">PostgreSQL 14+ on port 5432 or MySQL 8+ on port 3306.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f]">
                <div className="font-mono text-xs font-bold text-white">3. Modern Browser</div>
                <p className="text-[11px] text-[#8b92ab] mt-1">Chrome, Edge, Firefox, or Safari for the frontend UI.</p>
              </div>
            </div>
          </div>

          {/* Step 2: Database & application.properties */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-head text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#f5a623]" />
                Backend Configuration (application.properties)
              </h3>
              <button
                onClick={() => copyToClipboard('appProp', appPropertiesCode)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a1e28] hover:bg-[#222736] border border-[#2a2f3f] text-xs font-mono text-[#8b92ab] hover:text-white transition-all"
              >
                {copiedKey === 'appProp' ? <Check className="w-3.5 h-3.5 text-[#22d3a3]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'appProp' ? 'Copied' : 'Copy Config'}
              </button>
            </div>
            <p className="text-xs text-[#8b92ab] mb-3">
              Save this file in <code className="text-white font-mono">src/main/resources/application.properties</code> in your Spring Boot project:
            </p>
            <pre className="p-4 rounded-xl bg-[#0d0f14] border border-[#2a2f3f] text-[11px] font-mono text-[#22d3a3] overflow-x-auto leading-relaxed">
              {appPropertiesCode}
            </pre>
          </div>

          {/* Step 3: Terminal Commands */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-head text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#5c6ef8]" />
                Launch Commands
              </h3>
              <button
                onClick={() => copyToClipboard('commands', runCommands)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a1e28] hover:bg-[#222736] border border-[#2a2f3f] text-xs font-mono text-[#8b92ab] hover:text-white transition-all"
              >
                {copiedKey === 'commands' ? <Check className="w-3.5 h-3.5 text-[#22d3a3]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'commands' ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0d0f14] border border-[#2a2f3f] text-[11px] font-mono text-[#e8eaf2] overflow-x-auto leading-relaxed">
              {runCommands}
            </pre>
          </div>

        </div>
      )}

      {/* TAB 3: DATA & EVENT WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Core Flow: Product Creation & Low Stock Trigger */}
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6 space-y-6">
            <h3 className="font-head text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#7b8aff]" />
              Official System Flowchart &amp; Workflow (Figure 3.2)
            </h3>

            {/* Embedded Figure 3.2: Flowchart */}
            <div className="rounded-xl overflow-hidden border border-[#2a2f3f] bg-white p-3 shadow-md">
              <img
                src="/public/assets/aistudio/image_9c025673.png"
                alt="Figure 3.2: Workflow of Inventory Management Operations"
                className="w-full max-h-[480px] object-contain mx-auto"
              />
              <p className="text-center text-[11px] font-serif text-[#333] mt-2 font-medium">
                Figure 3.2: Workflow of Inventory Management Operations
              </p>
            </div>

            {/* Embedded Figure 3.3: ER Diagram */}
            <div className="rounded-xl overflow-hidden border border-[#2a2f3f] bg-white p-3 shadow-md">
              <img
                src="/public/assets/aistudio/image_e3ab7186.png"
                alt="Figure 3.3: Entity Relationship Diagram (ER Diagram)"
                className="w-full max-h-[450px] object-contain mx-auto"
              />
              <p className="text-center text-[11px] font-serif text-[#333] mt-2 font-medium">
                Figure 3.3: Entity Relationship Diagram Representing Database Structure
              </p>
            </div>

            <h4 className="font-head text-sm font-bold text-white pt-2">
              The 4 Core Operational Workflows Explained
            </h4>

            <div className="space-y-4">
              
              {/* 1. Auth Flow */}
              <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5c6ef8] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <h4 className="font-semibold text-white text-sm">Authentication Flow</h4>
                </div>
                <p className="text-xs text-[#8b92ab] leading-relaxed">
                  When a user signs up on <code className="text-white">register.html</code>, the backend hashes the password using Spring Security&apos;s <code className="text-white">BCryptPasswordEncoder</code> and persists to the <code className="text-white">users</code> table. Upon login, <code className="text-white">login.html</code> receives &quot;SUCCESS&quot; and saves the user identity into <code className="text-[#22d3a3]">localStorage.setItem(&quot;user&quot;, username)</code>. This username is attached in the <code className="text-[#7b8aff]">X-Username</code> HTTP request header on subsequent mutating requests.
                </p>
              </div>

              {/* 2. Low Stock Detection Logic */}
              <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f25c6e] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <h4 className="font-semibold text-white text-sm">Automated Low-Stock Threshold Detection</h4>
                </div>
                <p className="text-xs text-[#8b92ab] leading-relaxed">
                  Every product has a <code className="text-white">quantity</code> and a <code className="text-white">lowStockThreshold</code> (defaults to 10). Whenever a product is created or updated, the system evaluates:
                </p>
                <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#2a2f3f] font-mono text-[11px] text-[#f25c6e]">
                  product.status = (quantity &lt;= lowStockThreshold) ? &quot;LOW_STOCK&quot; : &quot;AVAILABLE&quot;;
                </div>
                <p className="text-xs text-[#8b92ab]">
                  In the UI, low-stock items trigger red badge highlights, warning alerts on the dashboard, and inclusion in the critical reorder list.
                </p>
              </div>

              {/* 3. Stock Audit History */}
              <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#22d3a3] text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  <h4 className="font-semibold text-white text-sm">Stock History Audit Trail</h4>
                </div>
                <p className="text-xs text-[#8b92ab] leading-relaxed">
                  For inventory integrity, all operations create a corresponding record in <code className="text-white">stock_history</code>:
                </p>
                <ul className="text-xs text-[#8b92ab] space-y-1 list-disc list-inside">
                  <li><strong className="text-white">POST /products:</strong> Logs <code className="text-[#22d3a3]">ADDED</code> with <code className="text-white">oldQuantity=null, newQuantity=N</code>.</li>
                  <li><strong className="text-white">PUT /products/{'{id}'}:</strong> Logs <code className="text-[#f5a623]">UPDATED</code> with <code className="text-white">oldQuantity=oldVal, newQuantity=newVal</code>.</li>
                  <li><strong className="text-white">DELETE /products/{'{id}'}:</strong> Logs <code className="text-[#f25c6e]">DELETED</code> with <code className="text-white">oldQuantity=oldVal, newQuantity=null</code>.</li>
                </ul>
              </div>

              {/* 4. CSV Data Export */}
              <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#a78bfa] text-white text-[11px] font-bold flex items-center justify-center">4</span>
                  <h4 className="font-semibold text-white text-sm">Browser-Side CSV Data Export</h4>
                </div>
                <p className="text-xs text-[#8b92ab] leading-relaxed">
                  The <code className="text-white">exportCSV()</code> function converts the current filtered products array into RFC-compliant CSV text with columns <code className="text-white">Name, Category, Price, Quantity, Low Stock At, Status</code>, creates a transient <code className="text-white">Blob</code> object, and triggers an instant download without burdening backend bandwidth.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 4: TROUBLESHOOTING & CORS */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6 space-y-5">
            <h3 className="font-head text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#f25c6e]" />
              Common Issues &amp; How to Fix Them in Current Development
            </h3>

            {/* Issue 1: CORS */}
            <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-[#f25c6e] font-mono font-bold">1. CORS Blocked Error</span>
                <span className="text-xs font-mono text-[#8b92ab]">(Failed to fetch localhost:8080)</span>
              </h4>
              <p className="text-xs text-[#8b92ab]">
                Browsers block requests between <code className="text-white">http://localhost:3000</code> or <code className="text-white">file://</code> and <code className="text-white">http://localhost:8080</code> unless CORS headers are returned.
              </p>
              <div className="p-3 rounded-lg bg-[#0d0f14] border border-[#2a2f3f] text-xs font-mono text-[#22d3a3]">
                <div>// Add to your Spring Boot Controller or Config:</div>
                <div className="text-white font-bold">@CrossOrigin(origins = &quot;*&quot;)</div>
                <div>@RestController</div>
                <div>@RequestMapping(&quot;/products&quot;)</div>
              </div>
            </div>

            {/* Issue 2: MySQL vs PostgreSQL */}
            <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-[#f5a623] font-mono font-bold">2. MySQL vs PostgreSQL in pom.xml</span>
              </h4>
              <p className="text-xs text-[#8b92ab]">
                Notice that the user <code className="text-white">README.md</code> mentions MySQL, but the <code className="text-white">pom.xml</code> specifies <code className="text-white">&lt;artifactId&gt;postgresql&lt;/artifactId&gt;</code>!
              </p>
              <div className="text-xs text-[#8b92ab] space-y-1">
                <p>• If using <strong className="text-white">PostgreSQL</strong>: keep <code className="text-white">postgresql</code> in pom.xml and use <code className="text-[#22d3a3]">jdbc:postgresql://localhost:5432/inventory_db</code>.</p>
                <p>• If using <strong className="text-white">MySQL</strong>: replace postgresql with <code className="text-white">&lt;artifactId&gt;mysql-connector-j&lt;/artifactId&gt;</code> in pom.xml and use <code className="text-[#22d3a3]">jdbc:mysql://localhost:3306/inventory_db</code>.</p>
              </div>
            </div>

            {/* Issue 3: Port 8080 Conflict */}
            <div className="p-4 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-[#38bdf8] font-mono font-bold">3. Port 8080 already in use</span>
              </h4>
              <p className="text-xs text-[#8b92ab]">
                If another process or previous Spring run is occupying port 8080:
              </p>
              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#2a2f3f] font-mono text-[11px] text-[#e8eaf2]">
                # On Windows:<br />
                netstat -ano | findstr 8080<br />
                taskkill /F /PID &lt;PID&gt;<br /><br />
                # On Linux/macOS:<br />
                lsof -i :8080<br />
                kill -9 &lt;PID&gt;
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
