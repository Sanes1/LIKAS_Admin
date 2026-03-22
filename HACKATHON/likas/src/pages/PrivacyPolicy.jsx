import TextToSpeech from '../components/TextToSpeech';

export default function PrivacyPolicy() {
  const fullText = `Privacy Policy. Last Updated: March 15, 2026. At LIKAS (Local Impact Knowledge and Skills), we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our educational platform. 1. Information We Collect. Personal Information: Name, email address, LRN (Learner Reference Number), school affiliation, and profile photo. Academic Information: Project submissions, grades, token earnings, and academic progress. Usage Data: Platform interactions, login times, feature usage, and performance analytics. Communication Data: Messages, support requests, and feedback submissions. Device Information: IP address, browser type, device identifiers, and technical specifications. 2. How We Use Your Information. Educational Services: To provide personalized learning experiences and track academic progress. To facilitate connections with community partners and project opportunities. To assess project submissions and award tokens appropriately. Communication: To send important platform updates, project notifications, and educational content. To respond to support requests and provide customer service. To notify users of new features and opportunities. Platform Improvement: To analyze usage patterns and improve platform functionality. To develop new educational features and enhance user experience. To ensure platform security and prevent fraudulent activities. Legal Compliance: To comply with educational regulations and legal requirements. To protect the rights and safety of our users and community partners. 3. Information Sharing and Disclosure. We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances: Educational Institutions: With your school or educational institution for academic verification and progress tracking. Community Partners: Limited project-related information with verified barangay partners for collaboration purposes. Service Providers: With trusted third-party services that help us operate the platform (hosting, analytics, communication tools). Legal Requirements: When required by law, court order, or to protect the rights and safety of our users. Business Transfers: In the event of a merger, acquisition, or sale of assets, with appropriate user notification. 4. Data Security and Protection. We implement industry-standard security measures to protect your information: Encryption of sensitive data in transit and at rest. Regular security audits and vulnerability assessments. Access controls and authentication requirements for staff. Secure data centers with physical and digital protection measures. Regular backups and disaster recovery procedures. 5. Your Privacy Rights and Choices. You have the following rights regarding your personal information: Access: Request a copy of the personal information we hold about you. Correction: Update or correct inaccurate personal information. Deletion: Request deletion of your personal information (subject to legal and academic requirements). Portability: Request a copy of your data in a portable format. Opt-out: Unsubscribe from non-essential communications. Account Control: Modify privacy settings and control information sharing preferences. 6. Cookies and Tracking Technologies. We use cookies and similar technologies to: Remember your login preferences and platform settings. Analyze platform usage and improve user experience. Provide personalized content and recommendations. Ensure platform security and prevent unauthorized access. You can control cookie settings through your browser preferences. 7. Third-Party Services and Links. Our platform may integrate with third-party educational tools and services. We may include links to external websites and resources. This Privacy Policy does not cover third-party services or websites. We encourage users to review the privacy policies of any third-party services they use. 8. Children's Privacy and Parental Consent. LIKAS is designed for students aged 16 and above. Users under 18 must have parental or guardian consent to use the platform. We do not knowingly collect personal information from children under 13. Parents may request access to or deletion of their child's information. 9. International Data Transfers. Your information may be processed and stored in servers located outside the Philippines. We ensure appropriate safeguards are in place for international data transfers. We comply with applicable data protection laws and regulations. 10. Data Retention and Deletion. We retain your information for as long as necessary to provide educational services. Academic records may be retained for institutional requirements and verification purposes. You may request account deletion, subject to legal and academic obligations. Deleted data is securely destroyed according to our data retention policies. 11. Changes to This Privacy Policy. We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Users will be notified of significant changes via email or platform notification. The "Last Updated" date indicates when the policy was most recently revised. Continued use of the platform after changes constitutes acceptance of the updated policy. 12. Contact Information and Support. If you have questions about this Privacy Policy or your privacy rights, please contact us: Email: privacy@likas.edu.ph. Address: LIKAS Educational Platform, Philippines. Support: Available through platform messaging system. Data Protection Officer: Available for privacy-related inquiries and concerns. We are committed to addressing your privacy concerns promptly and transparently. By using LIKAS, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein.`;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>Privacy Policy</h1>
        <TextToSpeech text={fullText} />
      </div>
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Information We Collect</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          When you register for LIKAS, we collect the following information:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Full name</li>
          <li>Email address</li>
          <li>Learner Reference Number (LRN)</li>
          <li>School name</li>
          <li>Project submissions and related files</li>
          <li>Token balance and transaction history</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. How We Use Your Information</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We use your information to:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Create and manage your account</li>
          <li>Process and verify project submissions</li>
          <li>Award and track tokens</li>
          <li>Connect you with community projects</li>
          <li>Communicate important updates about the Platform</li>
          <li>Improve our services and user experience</li>
          <li>Comply with academic and legal requirements</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. Information Sharing</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We may share your information with:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Your school or educational institution for academic credit verification</li>
          <li>Local government units (LGUs) for project coordination</li>
          <li>Commission on Higher Education (CHED) for accreditation purposes</li>
          <li>Service providers who help us operate the Platform</li>
        </ul>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginTop: '12px' }}>
          We will never sell your personal information to third parties.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Data Security</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We implement industry-standard security measures to protect your information, including:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Encrypted data transmission (HTTPS)</li>
          <li>Secure cloud storage with Firebase</li>
          <li>Regular security audits</li>
          <li>Access controls and authentication</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Your Rights</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          You have the right to:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Access your personal information</li>
          <li>Request corrections to your data</li>
          <li>Delete your account and associated data</li>
          <li>Export your project submissions</li>
          <li>Opt out of non-essential communications</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Cookies and Tracking</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We use local storage to maintain your login session and preferences. We do not use third-party 
          tracking cookies for advertising purposes.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>7. Children's Privacy</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          LIKAS is designed for students of all ages. For users under 18, we recommend parental guidance 
          when participating in community projects.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>8. Changes to Privacy Policy</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We may update this Privacy Policy periodically. We will notify you of significant changes via 
          email or through the Platform.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>9. Contact Us</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          For privacy-related questions or to exercise your rights, contact us at privacy@likas.edu.ph
        </p>
      </section>
    </div>
  );
}
