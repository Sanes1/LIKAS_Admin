import TextToSpeech from '../components/TextToSpeech';

export default function DataPolicy() {
  const fullText = `Data Policy. Last Updated: March 15, 2026. This Data Policy explains how LIKAS (Local Impact Knowledge and Skills) collects, processes, stores, and protects your data in compliance with Philippine data protection laws and international best practices. 1. Data Collection Principles. We collect only the minimum data necessary to provide educational services. All data collection is transparent and with your informed consent. We respect your rights and provide control over your personal information. Data collection serves legitimate educational and platform improvement purposes. 2. Types of Data We Collect. Identity Data: Full name, email address, profile photo, and contact information. Educational Data: LRN (Learner Reference Number), school affiliation, academic level, and program of study. Project Data: Submissions, research work, calculations, documentation, and academic outputs. Performance Data: Grades, token earnings, project completion rates, and academic progress metrics. Technical Data: IP address, browser information, device identifiers, and platform usage analytics. Communication Data: Messages, feedback, support requests, and interaction history. 3. Legal Basis for Data Processing. We process your data based on the following legal grounds: Consent: You have given clear consent for specific data processing activities. Contract: Processing is necessary to fulfill our educational service agreement with you. Legal Obligation: We must process data to comply with educational regulations and legal requirements. Legitimate Interest: Processing serves our legitimate business interests while respecting your privacy rights. 4. Data Processing Activities. Educational Service Delivery: Matching students with appropriate community projects and academic opportunities. Tracking academic progress and awarding tokens based on project completion. Facilitating communication between students, educators, and community partners. Platform Analytics and Improvement: Analyzing usage patterns to enhance platform functionality and user experience. Developing new educational features and improving existing services. Ensuring platform security and preventing fraudulent or inappropriate use. Quality Assurance: Reviewing project submissions for academic integrity and quality standards. Providing feedback and educational support to improve student outcomes. Maintaining records for academic verification and institutional requirements. 5. Data Sharing and Third-Party Access. Educational Institutions: We share relevant academic data with your registered school or educational institution for verification, progress tracking, and degree requirement fulfillment. Community Partners: Limited project-related information is shared with verified barangay partners to facilitate collaboration and ensure project relevance. Service Providers: We work with trusted third-party services for platform hosting, data analytics, communication tools, and security services. All service providers are bound by strict data protection agreements. Government Agencies: We may share data when required by law, court order, or regulatory compliance, particularly with educational authorities and data protection agencies. 6. Data Storage and Security. Data Location: Your data is primarily stored on secure servers within the Philippines, with backup systems in compliance with local data residency requirements. Security Measures: We implement comprehensive security controls including encryption, access controls, regular security audits, intrusion detection systems, and employee training on data protection. Retention Periods: Personal data is retained only as long as necessary for educational purposes, typically for the duration of your academic program plus additional years for verification and alumni services. Backup and Recovery: We maintain secure backups to ensure data availability and implement disaster recovery procedures to protect against data loss. 7. Your Data Rights Under Philippine Law. Right to Information: You can request information about what personal data we hold and how it is processed. Right to Access: You can obtain a copy of your personal data in a commonly used electronic format. Right to Rectification: You can request correction of inaccurate or incomplete personal data. Right to Erasure: You can request deletion of your personal data, subject to legal and academic requirements. Right to Restrict Processing: You can request limitation of how your data is processed in certain circumstances. Right to Data Portability: You can request transfer of your data to another service provider in a structured format. Right to Object: You can object to certain types of data processing, particularly for marketing purposes. 8. Data Breach Response. Incident Detection: We maintain monitoring systems to detect potential data breaches or security incidents promptly. Response Procedures: In the event of a data breach, we will assess the risk, contain the incident, investigate the cause, and implement corrective measures. Notification Requirements: We will notify relevant authorities and affected users within the timeframes required by Philippine data protection law. Remediation: We will provide support to affected users and take steps to prevent similar incidents in the future. 9. International Data Transfers. Cross-Border Processing: Some data processing may occur outside the Philippines through our international service providers and partners. Adequacy and Safeguards: We ensure appropriate safeguards are in place for international transfers, including adequacy decisions, standard contractual clauses, or other approved mechanisms. User Consent: We obtain explicit consent for international transfers where required by law. 10. Children's Data Protection. Age Requirements: LIKAS is intended for students aged 16 and above, with parental consent required for users under 18. Special Protections: We implement additional safeguards for data belonging to minors, including enhanced consent mechanisms and limited data collection. Parental Rights: Parents and guardians have the right to access, correct, or request deletion of their child's data. 11. Data Subject Requests and Complaints. Request Process: You can submit data protection requests through our dedicated privacy portal or by contacting our Data Protection Officer. Response Timeframes: We will respond to your requests within the timeframes specified by Philippine data protection law, typically within 30 days. Complaint Resolution: If you are not satisfied with our response, you can file a complaint with the National Privacy Commission of the Philippines. 12. Updates to This Data Policy. Policy Changes: We may update this Data Policy to reflect changes in our practices, technology, or legal requirements. Notification: Users will be notified of significant changes through email, platform notifications, or prominent website notices. Acceptance: Continued use of the platform after policy updates constitutes acceptance of the revised terms. 13. Contact Information for Data Protection. Data Protection Officer: privacy@likas.edu.ph. General Inquiries: support@likas.edu.ph. Mailing Address: LIKAS Educational Platform, Data Protection Office, Philippines. National Privacy Commission: For complaints or concerns about our data practices, you may also contact the NPC directly. We are committed to protecting your privacy and ensuring compliance with all applicable data protection laws. This Data Policy demonstrates our dedication to transparency, accountability, and respect for your privacy rights.`;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>Data Policy</h1>
        <TextToSpeech text={fullText} />
      </div>
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Overview</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          This Data Policy explains how LIKAS collects, uses, stores, and shares your data. By using our Platform, 
          you acknowledge and consent to the practices described in this policy.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. Data Collection Methods</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We collect data through:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Information you provide during registration</li>
          <li>Project submissions and uploaded files</li>
          <li>Your interactions with the Platform (page views, clicks)</li>
          <li>AI-assisted analysis of your project submissions</li>
          <li>Communication with support or other users</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. Data Storage</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          Your data is stored securely using:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li><strong>Firebase Firestore:</strong> User profiles, project metadata, and token balances</li>
          <li><strong>Firebase Storage:</strong> Uploaded project files and documents</li>
          <li><strong>Firebase Authentication:</strong> Secure login credentials</li>
          <li><strong>Local Storage:</strong> Session data and user preferences (stored on your device)</li>
        </ul>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginTop: '12px' }}>
          All data is stored in secure cloud servers with encryption at rest and in transit.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Data Usage</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We use your data to:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Provide personalized educational experiences</li>
          <li>Match you with relevant community projects</li>
          <li>Generate AI-powered insights on your submissions</li>
          <li>Track your progress and achievements</li>
          <li>Facilitate collaboration with LGUs and educational institutions</li>
          <li>Improve Platform features and user experience</li>
          <li>Generate anonymized analytics and reports</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Data Sharing with Partners</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          Your data may be shared with authorized partners:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li><strong>Educational Institutions:</strong> Your school can access your project submissions and token balance for academic credit verification</li>
          <li><strong>Local Government Units:</strong> LGUs can view projects relevant to their community needs</li>
          <li><strong>CHED Assessors:</strong> For accreditation and quality assurance purposes</li>
          <li><strong>AI Service Providers:</strong> Project content may be processed by AI services for analysis (data is not stored by these providers)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Data Retention</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We retain your data for the following periods:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li><strong>Active accounts:</strong> Data retained while your account is active</li>
          <li><strong>Inactive accounts:</strong> Data retained for 2 years after last login</li>
          <li><strong>Project submissions:</strong> Retained for 5 years for academic records</li>
          <li><strong>Deleted accounts:</strong> Most data deleted within 30 days (some records retained for legal compliance)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>7. Data Portability</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          You can request a copy of your data in machine-readable format (JSON) at any time. This includes:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Profile information</li>
          <li>Project submission history</li>
          <li>Token transaction records</li>
          <li>Uploaded files</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>8. Third-Party Services</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          LIKAS uses the following third-party services that may access your data:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li><strong>Google Firebase:</strong> Cloud infrastructure and authentication</li>
          <li><strong>Google reCAPTCHA:</strong> Bot protection (subject to Google's privacy policy)</li>
          <li><strong>AI Analysis Services:</strong> For project evaluation and feedback</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>9. Data Breach Protocol</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          In the event of a data breach, we will:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Notify affected users within 72 hours</li>
          <li>Provide details about the breach and affected data</li>
          <li>Offer guidance on protective measures</li>
          <li>Report to relevant authorities as required by law</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>10. Your Control Over Data</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          You can manage your data by:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Updating your profile information at any time</li>
          <li>Deleting individual project submissions</li>
          <li>Requesting account deletion</li>
          <li>Opting out of data sharing with specific partners (may limit Platform functionality)</li>
          <li>Downloading your data export</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>11. Contact for Data Requests</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          For data-related requests or questions, contact our Data Protection Officer at data@likas.edu.ph
        </p>
      </section>
    </div>
  );
}
