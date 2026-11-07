import React, { useState } from 'react';
import { FileCode2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const SpringBootCodeView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const files: CodeFile[] = [
    {
      name: 'Product.java',
      path: 'src/main/java/com/inventory/model/Product.java',
      description: 'JPA Entity representing inventory products with status computation based on lowStockThreshold.',
      code: `package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0)
    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 10;

    @Column(nullable = false)
    private String status; // "AVAILABLE" or "LOW_STOCK"

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        updateStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        updateStatus();
    }

    public void updateStatus() {
        int threshold = (lowStockThreshold != null) ? lowStockThreshold : 10;
        this.status = (quantity != null && quantity <= threshold) ? "LOW_STOCK" : "AVAILABLE";
    }
}`
    },
    {
      name: 'StockHistory.java',
      path: 'src/main/java/com/inventory/model/StockHistory.java',
      description: 'Audit log entity recording each stock modification, old quantity, new quantity, and operator signature.',
      code: `package com.inventory.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "change_type", nullable = false)
    private String changeType; // "ADDED", "UPDATED", "DELETED"

    @Column(name = "old_quantity")
    private Integer oldQuantity;

    @Column(name = "new_quantity")
    private Integer newQuantity;

    @Column(name = "changed_by", nullable = false)
    private String changedBy;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        this.changedAt = LocalDateTime.now();
    }
}`
    },
    {
      name: 'ProductController.java',
      path: 'src/main/java/com/inventory/controller/ProductController.java',
      description: 'REST Controller with CRUD endpoints and automated StockHistory creation.',
      code: `package com.inventory.controller;

import com.inventory.model.Product;
import com.inventory.model.StockHistory;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockHistoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*") // Allows calls from HTML frontend
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final StockHistoryRepository stockHistoryRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product,
                             @RequestHeader(value = "X-Username", defaultValue = "system") String username) {
        product.updateStatus();
        Product saved = productRepository.save(product);

        // Record stock history audit
        stockHistoryRepository.save(StockHistory.builder()
                .productId(saved.getId())
                .productName(saved.getName())
                .changeType("ADDED")
                .oldQuantity(null)
                .newQuantity(saved.getQuantity())
                .changedBy(username)
                .build());

        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                @Valid @RequestBody Product updated,
                                                @RequestHeader(value = "X-Username", defaultValue = "system") String username) {
        return productRepository.findById(id).map(existing -> {
            Integer oldQty = existing.getQuantity();

            existing.setName(updated.getName());
            existing.setCategory(updated.getCategory());
            existing.setPrice(updated.getPrice());
            existing.setQuantity(updated.getQuantity());
            existing.setLowStockThreshold(updated.getLowStockThreshold());
            existing.updateStatus();

            Product saved = productRepository.save(existing);

            // Record audit log
            stockHistoryRepository.save(StockHistory.builder()
                    .productId(saved.getId())
                    .productName(saved.getName())
                    .changeType("UPDATED")
                    .oldQuantity(oldQty)
                    .newQuantity(saved.getQuantity())
                    .changedBy(username)
                    .build());

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
                                              @RequestHeader(value = "X-Username", defaultValue = "system") String username) {
        return productRepository.findById(id).map(existing -> {
            stockHistoryRepository.save(StockHistory.builder()
                    .productId(existing.getId())
                    .productName(existing.getName())
                    .changeType("DELETED")
                    .oldQuantity(existing.getQuantity())
                    .newQuantity(null)
                    .changedBy(username)
                    .build());

            productRepository.delete(existing);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}`
    },
    {
      name: 'AuthController.java',
      path: 'src/main/java/com/inventory/controller/AuthController.java',
      description: 'Authentication controller with BCrypt password hashing matching login.html & register.html.',
      code: `package com.inventory.controller;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginReq) {
        return userRepository.findByUsername(loginReq.getUsername())
                .filter(u -> passwordEncoder.matches(loginReq.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok("SUCCESS"))
                .orElse(ResponseEntity.status(401).body("FAILED"));
    }
}`
    },
    {
      name: 'SecurityConfig.java',
      path: 'src/main/java/com/inventory/config/SecurityConfig.java',
      description: 'Spring Security configuration defining BCrypt bean and allowing open CORS for frontend consumption.',
      code: `package com.inventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`
    }
  ];

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = files[activeFileIndex];

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2a2f3f]">
        <div>
          <h1 className="font-head text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Spring Boot Java Classes
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
              Spring Boot 3.5.x • Java 21
            </span>
          </h1>
          <p className="text-sm text-[#8b92ab] mt-1">
            Production-ready backend controllers, JPA entities, and configuration matching your <code className="text-white">pom.xml</code> and frontend REST contracts.
          </p>
        </div>

        <button
          onClick={() => handleCopy(activeFileIndex, activeFile.code)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5c6ef8] hover:bg-[#7b8aff] text-white text-xs font-bold shadow-[0_0_15px_rgba(92,110,248,0.3)] transition-all self-start sm:self-auto"
        >
          {copiedIndex === activeFileIndex ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Copied {activeFile.name}!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Current File</span>
            </>
          )}
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {files.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => setActiveFileIndex(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeFileIndex === idx
                ? 'bg-[#1a1e28] text-white border border-[#5c6ef8]/50 shadow-[0_0_12px_rgba(92,110,248,0.2)]'
                : 'bg-[#13161e] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#1a1e28]'
            }`}
          >
            <FileCode2 className={`w-3.5 h-3.5 ${activeFileIndex === idx ? 'text-[#7b8aff]' : 'text-[#8b92ab]'}`} />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Code Display Box */}
      <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#1a1e28] border-b border-[#2a2f3f] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
              <span className="text-[#5c6ef8]">Path:</span>
              <span>{activeFile.path}</span>
            </div>
            <p className="text-[11px] text-[#8b92ab]">{activeFile.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#555d76] uppercase">Java 21</span>
          </div>
        </div>

        <pre className="p-5 text-xs font-mono text-[#e8eaf2] bg-[#0d0f14] overflow-x-auto leading-relaxed max-h-[580px] overflow-y-auto">
          {activeFile.code}
        </pre>
      </div>

    </div>
  );
};
