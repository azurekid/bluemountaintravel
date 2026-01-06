# Blue Mountain Travel - Documentation Index

Welcome to the Blue Mountain Travel security training application documentation. This index helps you navigate the comprehensive documentation available for this intentionally vulnerable application.

---

## 📚 Documentation Overview

This project includes extensive documentation covering vulnerabilities, Azure resources, deployment, and security analysis. All documentation is designed for security training and educational purposes.

---

## 🔍 Quick Navigation

### For Security Researchers & Penetration Testers
1. Start with [**VULNERABILITIES_REFERENCE.md**](VULNERABILITIES_REFERENCE.md) for complete vulnerability catalog
2. Review [**VULNERABILITY_GUIDE.md**](../VULNERABILITY_GUIDE.md) for CTF flags and exploitation walkthroughs
3. Check [**AZURE_RESOURCES_DATA_MAP.md**](AZURE_RESOURCES_DATA_MAP.md) to understand data storage locations

### For Security Trainers & Educators
1. Read [**SECURITY_GUIDE.md**](SECURITY_GUIDE.md) for detailed vulnerability analysis
2. Use [**IMPLEMENTATION_SUMMARY.md**](IMPLEMENTATION_SUMMARY.md) to understand the project structure
3. Reference [**DEPLOYMENT.md**](DEPLOYMENT.md) for Azure deployment instructions

### For Developers & Security Engineers
1. Study [**VULNERABILITIES_REFERENCE.md**](VULNERABILITIES_REFERENCE.md) for remediation guidance
2. Review [**SECURITY_GUIDE.md**](SECURITY_GUIDE.md) for secure coding practices
3. Examine [**AZURE_RESOURCES_DATA_MAP.md**](AZURE_RESOURCES_DATA_MAP.md) for proper Azure configuration

---

## 📖 Complete Documentation List

### 1. [VULNERABILITIES_REFERENCE.md](VULNERABILITIES_REFERENCE.md) ⭐ NEW
**Size**: 31 KB | **Lines**: 739

**Complete Vulnerabilities Catalog**

The most comprehensive document covering all 68 security vulnerabilities in the application.

**Contents**:
- 14 vulnerability categories (Authentication, Credentials, Storage, Database, etc.)
- 68 unique security issues with CTF flags
- Detailed exploitation methods for each vulnerability
- Severity ratings (Critical, High, Medium, Low)
- Complete remediation guidance with code examples
- OWASP Top 10 and CWE mappings
- Compliance impact analysis (GDPR, PCI DSS, HIPAA, SOC 2)
- Testing and validation procedures
- Remediation priority matrix

**Use Cases**:
- Security code review training
- Penetration testing practice
- Vulnerability research
- Security assessment learning
- Compliance training

---

### 2. [AZURE_RESOURCES_DATA_MAP.md](AZURE_RESOURCES_DATA_MAP.md) ⭐ NEW
**Size**: 30 KB | **Lines**: 1,100

**Complete Azure Resources and Data Mapping**

Comprehensive documentation of every Azure resource and what data is stored where.

**Contents**:
- **Azure Storage Account** - 4 containers (bookings, profiles, documents, passports)
  - Detailed file structure and naming conventions
  - Data fields in each container
  - Access methods and SAS token details
- **Azure SQL Database** - 7 tables with complete schemas
  - Users, UserPaymentInfo, Flights, Hotels, Bookings, Employees, AuditLog
  - Sample data and row counts
  - Data sensitivity classification
- **Azure Cosmos DB** - TravelBookings database structure
- **Azure Key Vault** - 6 secrets with purposes and values
- **Azure Static Web Apps** - Deployed content and configuration
- **Azure Entra ID (Azure AD)** - Users, groups, and policies
- **Service Principals** - 3 service principals with role assignments
- **Managed Identities** - 1 managed identity configuration
- Data flow diagrams
- Data classification matrix (Critical, High, Medium, Public)
- Privacy and compliance analysis (GDPR, PCI DSS, HIPAA, SOC 2)
- Recommended remediation actions

**Use Cases**:
- Understanding attack surface
- Data privacy assessment
- Compliance auditing
- Security architecture review
- Incident response planning

---

### 3. [SECURITY_GUIDE.md](SECURITY_GUIDE.md)
**Size**: 18 KB | **Lines**: 669

**Detailed Security Vulnerabilities Guide**

In-depth analysis of the 10 major vulnerability categories with exploitation examples.

**Contents**:
- 10 major vulnerability types with detailed descriptions
- Location of vulnerabilities in code
- Step-by-step exploitation instructions
- Real-world impact analysis
- OWASP Top 10 mappings
- CWE (Common Weakness Enumeration) references
- Code examples showing vulnerable patterns
- Secure code examples for remediation
- Training exercises for each vulnerability type
- Summary table with severity ratings

**Covered Vulnerabilities**:
1. Exposed Azure SAS Tokens
2. Hardcoded Credentials
3. Public Blob Storage
4. Sensitive Data in localStorage
5. No Authentication/Authorization
6. Information Disclosure
7. Insecure Direct Object References (IDOR)
8. Client-Side Security Controls
9. Long-Lived Tokens
10. Missing Security Headers

**Use Cases**:
- Security awareness training
- Secure coding workshops
- Code review exercises
- Vulnerability identification practice

---

### 4. [DEPLOYMENT.md](DEPLOYMENT.md)
**Size**: 11 KB | **Lines**: 343

**Azure Deployment Guide**

Complete guide for deploying the vulnerable infrastructure to Azure for training purposes.

**Contents**:
- Deployment architecture diagram
- 3 deployment options (Local, Static Web App, Full Infrastructure)
- Step-by-step Azure CLI commands
- Resource creation scripts for:
  - Resource Group
  - Storage Account with public containers
  - Azure SQL Database with weak credentials
  - Static Web Apps deployment
- ARM template deployment option
- Post-deployment verification steps
- Training exercises using deployed infrastructure
- Security remediation examples (how to fix vulnerabilities)
- Cost estimation (~$6-7/month)
- Clean-up procedures

**Use Cases**:
- Setting up training environments
- Cloud security workshops
- Azure security demonstrations
- Red team exercises

---

### 5. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
**Size**: 7.8 KB | **Lines**: 212

**Project Implementation Summary**

Overview of the project structure, features, and implementation details.

**Contents**:
- Project overview and objectives
- Complete feature list (5 HTML pages, booking system, user profiles)
- File structure and organization
- Code statistics (HTML, CSS, JavaScript breakdown)
- Technology stack
- Quality assurance checklist
- Deployment options
- Training use cases
- Key achievements

**Use Cases**:
- Project onboarding
- Understanding application structure
- Training program planning

---

### 6. [../VULNERABILITY_GUIDE.md](../VULNERABILITY_GUIDE.md)
**Size**: 13 KB | **Lines**: 418

**CTF Flags and Vulnerability Walkthrough**

CTF-style guide with flags and exploitation techniques.

**Contents**:
- 60+ CTF flags organized by category
- User enumeration and password spraying techniques
- Authentication bypass methods
- Azure storage exploitation
- Passport data leakage
- Employee database exposure
- Lateral movement paths
- Admin panel access
- Complete flag list
- Known valid credentials for testing
- Exploitation commands and scripts

**Categories**:
- User Enumeration & Password Spraying
- Authentication Vulnerabilities
- Azure Storage Exposure
- Passport Data Leakage
- Employee Database Exposure
- Lateral Movement Paths
- Admin Panel Access

**Use Cases**:
- Capture The Flag (CTF) competitions
- Security challenge creation
- Penetration testing training
- Red team exercises

---

### 7. [../README.md](../README.md)
**Size**: 8 KB | **Lines**: 232

**Main Project README**

Primary documentation file with project overview and quick start guide.

**Contents**:
- Project description and warnings
- Feature overview (business and security training features)
- Quick start guide (installation and setup)
- Project structure
- Major vulnerability descriptions
- Learning exercises
- Security best practices (what NOT to do)
- Disclaimer and warnings

**Use Cases**:
- First-time setup
- Quick reference
- Project overview

---

## 📊 Documentation Statistics

| Document | Size | Lines | Focus Area |
|----------|------|-------|------------|
| VULNERABILITIES_REFERENCE.md | 31 KB | 739 | Complete vulnerability catalog |
| AZURE_RESOURCES_DATA_MAP.md | 30 KB | 1,100 | Azure resources and data |
| SECURITY_GUIDE.md | 18 KB | 669 | Major vulnerabilities analysis |
| VULNERABILITY_GUIDE.md | 13 KB | 418 | CTF flags and walkthroughs |
| DEPLOYMENT.md | 11 KB | 343 | Azure deployment |
| IMPLEMENTATION_SUMMARY.md | 7.8 KB | 212 | Project overview |
| README.md | 8 KB | 232 | Quick start guide |
| **TOTAL** | **~119 KB** | **~3,713 lines** | **Complete coverage** |

---

## 🎯 Documentation by User Role

### Security Trainers
**Recommended Reading Order**:
1. README.md - Understand the project
2. IMPLEMENTATION_SUMMARY.md - Project structure
3. SECURITY_GUIDE.md - Major vulnerabilities
4. VULNERABILITIES_REFERENCE.md - Complete catalog
5. DEPLOYMENT.md - Setup training environment

### Security Students/Learners
**Recommended Reading Order**:
1. README.md - Get started
2. VULNERABILITY_GUIDE.md - CTF challenges
3. SECURITY_GUIDE.md - Learn about vulnerabilities
4. VULNERABILITIES_REFERENCE.md - Deep dive
5. AZURE_RESOURCES_DATA_MAP.md - Understand data flow

### Penetration Testers
**Recommended Reading Order**:
1. VULNERABILITY_GUIDE.md - Quick exploitation guide
2. VULNERABILITIES_REFERENCE.md - All attack vectors
3. AZURE_RESOURCES_DATA_MAP.md - Target mapping
4. SECURITY_GUIDE.md - Detailed analysis

### Security Architects
**Recommended Reading Order**:
1. AZURE_RESOURCES_DATA_MAP.md - Architecture review
2. VULNERABILITIES_REFERENCE.md - Security gaps
3. SECURITY_GUIDE.md - Remediation guidance
4. DEPLOYMENT.md - Infrastructure setup

### Compliance Officers
**Recommended Reading Order**:
1. AZURE_RESOURCES_DATA_MAP.md - Data mapping
2. VULNERABILITIES_REFERENCE.md - Compliance violations
3. SECURITY_GUIDE.md - Risk assessment

---

## 🔑 Key Concepts Covered

### Security Vulnerabilities
- Authentication and authorization failures
- Credential exposure and hardcoded secrets
- Insecure data storage
- Azure cloud misconfigurations
- Lack of encryption
- Information disclosure
- IDOR (Insecure Direct Object References)
- Missing security controls
- Long-lived tokens and keys
- No rate limiting

### Azure Resources
- Storage Accounts and Blob Storage
- Azure SQL Database
- Azure Cosmos DB
- Azure Key Vault
- Azure Static Web Apps
- Azure Entra ID (Azure Active Directory)
- Service Principals
- Managed Identities
- SAS Tokens
- Connection Strings

### Data Types
- Personally Identifiable Information (PII)
- Financial data (credit cards, payments)
- Government IDs (passports, SSN)
- Authentication credentials
- Travel booking information
- Employee records
- System credentials
- API keys and secrets

### Compliance Frameworks
- GDPR (General Data Protection Regulation)
- PCI DSS (Payment Card Industry Data Security Standard)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOC 2 (Service Organization Control 2)
- ISO 27001
- NIST Cybersecurity Framework

### Security Standards
- OWASP Top 10
- CWE Top 25
- SANS Top 25
- Azure Security Benchmark
- CIS Controls

---

## 🛠️ How to Use This Documentation

### For Training Sessions
1. **Preparation**: Review IMPLEMENTATION_SUMMARY.md and README.md
2. **Environment Setup**: Follow DEPLOYMENT.md
3. **Teaching Material**: Use SECURITY_GUIDE.md for lectures
4. **Hands-on Exercises**: Use VULNERABILITY_GUIDE.md for labs
5. **Deep Dive**: Reference VULNERABILITIES_REFERENCE.md for details

### For Self-Study
1. **Start**: README.md for project overview
2. **Practice**: VULNERABILITY_GUIDE.md for CTF challenges
3. **Learn**: SECURITY_GUIDE.md for vulnerability details
4. **Master**: VULNERABILITIES_REFERENCE.md for comprehensive knowledge
5. **Understand**: AZURE_RESOURCES_DATA_MAP.md for architecture

### For Security Assessments
1. **Scope**: AZURE_RESOURCES_DATA_MAP.md to understand targets
2. **Test**: VULNERABILITIES_REFERENCE.md for test cases
3. **Exploit**: VULNERABILITY_GUIDE.md for exploitation methods
4. **Report**: Use severity ratings and remediation guidance
5. **Remediate**: Follow secure coding examples in SECURITY_GUIDE.md

---

## ⚠️ Important Warnings

### DO NOT:
- ❌ Deploy to production environments
- ❌ Use with real customer data
- ❌ Connect to production Azure subscriptions
- ❌ Store real credentials or secrets
- ❌ Use in compliance-regulated environments
- ❌ Share credentials outside training context

### DO:
- ✅ Use in isolated training environments
- ✅ Deploy in separate Azure subscriptions
- ✅ Use fake/test data only
- ✅ Set up cost alerts in Azure
- ✅ Delete resources after training
- ✅ Document as "Training Environment"
- ✅ Implement proper access controls for training environment

---

## 📧 Support and Contributions

For questions, issues, or contributions:
- Open an issue on GitHub
- Review existing documentation first
- Provide detailed descriptions
- Include screenshots when relevant

---

## 📝 Document Maintenance

**Last Updated**: 2024-01-15
**Documentation Version**: 1.0
**Total Documentation**: ~119 KB across 7 files
**Coverage**: Complete (vulnerabilities, resources, deployment, training)

---

## 🔗 External Resources

### Learning Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Azure Security Documentation](https://docs.microsoft.com/en-us/azure/security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Azure Documentation
- [Azure Storage Security](https://docs.microsoft.com/en-us/azure/storage/common/storage-security-guide)
- [Azure SQL Security](https://docs.microsoft.com/en-us/azure/azure-sql/database/security-overview)
- [Azure Key Vault Best Practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [Azure Security Baseline](https://docs.microsoft.com/en-us/security/benchmark/azure/)

### Security Standards
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [GDPR Official Text](https://gdpr-info.eu/)
- [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html)

---

**Remember: This is an intentionally vulnerable application for educational purposes only. Never use in production!**
