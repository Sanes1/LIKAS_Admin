import TextToSpeech from '../components/TextToSpeech';

export default function TermsOfService() {
  const fullText = `Terms of Service. Last Updated: March 15, 2026. Welcome to LIKAS (Local Impact Knowledge and Skills). By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully. 1. Acceptance of Terms. By creating an account or using LIKAS, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform. 2. Description of Service. LIKAS is an educational platform that connects students with real-world community projects in their local barangays. Students complete minor missions to earn tokens and unlock major capstone projects that fulfill academic requirements while creating positive community impact. 3. User Accounts and Registration. You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 16 years old or have parental consent to use LIKAS. Students must provide valid LRN (Learner Reference Number) and school information. 4. User Conduct and Responsibilities. You agree to use LIKAS only for lawful educational purposes. You will not submit false, misleading, or plagiarized project work. You will respect intellectual property rights and properly cite sources. You will maintain professional conduct when interacting with community partners. You will not attempt to circumvent our token system or manipulate project submissions. 5. Project Submissions and Academic Integrity. All project submissions must be original work completed by the registered student. Collaboration is allowed only when explicitly permitted by project guidelines. Students are responsible for ensuring their work meets academic standards. LIKAS reserves the right to review and verify project authenticity. Suspected academic dishonesty will be reported to relevant educational institutions. 6. Token System and Rewards. Tokens are earned through successful completion of verified projects. Token values are determined by project complexity and community impact. Tokens cannot be transferred between users or converted to monetary value. LIKAS reserves the right to adjust token values and requirements. 7. Community Partnerships. LIKAS facilitates connections between students and local government units. Students must follow all guidelines provided by community partners. LIKAS is not responsible for direct interactions between students and community partners. All project work must comply with local laws and regulations. 8. Intellectual Property. Students retain ownership of their original project work and research. By submitting projects, students grant LIKAS a license to display and promote their work. LIKAS owns all platform content, including software, design, and educational materials. Users may not reproduce or distribute LIKAS content without permission. 9. Privacy and Data Protection. We collect and process personal information as described in our Privacy Policy. Student project data is used for educational assessment and platform improvement. We implement appropriate security measures to protect user data. Users have rights regarding their personal information as outlined in our Privacy Policy. 10. Platform Availability and Modifications. LIKAS strives to maintain platform availability but cannot guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue features with reasonable notice. System maintenance may temporarily limit platform access. 11. Limitation of Liability. LIKAS provides the platform "as is" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages. Our liability is limited to the maximum extent permitted by law. Students are responsible for their own safety during community project activities. 12. Termination. Either party may terminate the account relationship at any time. LIKAS may suspend or terminate accounts for violations of these terms. Upon termination, access to platform features will be revoked. Students may request data export before account closure. 13. Dispute Resolution. Any disputes will be resolved through binding arbitration in the Philippines. These terms are governed by Philippine law. Students may contact our support team for assistance with platform-related issues. 14. Changes to Terms. We may update these Terms of Service periodically. Users will be notified of significant changes via email or platform notification. Continued use after changes constitutes acceptance of new terms. 15. Contact Information. For questions about these Terms of Service, contact us at: Email: legal@likas.edu.ph. Address: LIKAS Educational Platform, Philippines. Support: Available through platform messaging system. By using LIKAS, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.`;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>Terms of Service</h1>
        <TextToSpeech text={fullText} />
      </div>
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Last Updated: March 15, 2026</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          By accessing and using LIKAS ("the Platform"), you accept and agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use the Platform.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>2. Eligibility</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          You must be a currently enrolled student with a valid Learner Reference Number (LRN) to use this Platform. 
          By registering, you confirm that all information provided is accurate and up-to-date.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>3. User Responsibilities</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          As a user of LIKAS, you agree to:
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
          <li>Provide accurate and truthful information in all project submissions</li>
          <li>Complete community projects with integrity and professionalism</li>
          <li>Respect the intellectual property rights of others</li>
          <li>Not misuse the token system or attempt to manipulate rewards</li>
          <li>Maintain the confidentiality of your account credentials</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>4. Project Submissions</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          All project submissions must be your original work. Plagiarism or fraudulent submissions will result in 
          account suspension and forfeiture of earned tokens. LIKAS reserves the right to verify the authenticity 
          of any submitted project.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>5. Token System</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          Tokens earned through project completion are virtual rewards within the Platform. They have no monetary 
          value and cannot be exchanged for cash. LIKAS may modify the token system at any time with notice to users.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>6. Account Termination</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          LIKAS reserves the right to suspend or terminate accounts that violate these Terms of Service, 
          engage in fraudulent activity, or misuse the Platform in any way.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>7. Limitation of Liability</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          LIKAS is provided "as is" without warranties of any kind. We are not liable for any damages arising 
          from your use of the Platform or participation in community projects.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>8. Changes to Terms</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          We may update these Terms of Service from time to time. Continued use of the Platform after changes 
          constitutes acceptance of the updated terms.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>9. Contact Information</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#374151', marginBottom: '12px' }}>
          For questions about these Terms of Service, please contact us at support@likas.edu.ph
        </p>
      </section>
    </div>
  );
}
