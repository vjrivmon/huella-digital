-- Huella Digital - Seed Data: GDPR Templates
-- Run this after the initial schema migration

-- ============================================
-- SPANISH TEMPLATES
-- ============================================

-- Erasure (Right to be forgotten) - Spanish
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'erasure',
    'es',
    'Solicitud de supresión estándar',
    'Template general para solicitar eliminación de datos personales',
    'Solicitud de supresión de datos personales - RGPD Art. 17',
    'Estimado/a responsable de protección de datos,

Por medio de la presente, y en ejercicio del derecho de supresión reconocido en el artículo 17 del Reglamento General de Protección de Datos (RGPD), solicito la eliminación de todos mis datos personales que obran en sus sistemas.

**Datos del solicitante:**
- Nombre completo: {{user_name}}
- Correo electrónico: {{user_email}}
- Fecha de la solicitud: {{date}}

**Datos a eliminar:**
{{target_data_description}}

**Fundamento jurídico:**
De conformidad con el artículo 17 del RGPD, tengo derecho a obtener la supresión de mis datos personales cuando:
- Los datos ya no son necesarios para los fines para los que fueron recogidos
- Retiro mi consentimiento y no existe otro fundamento jurídico para el tratamiento
- Los datos han sido tratados ilícitamente

Le recuerdo que, según el artículo 12.3 del RGPD, dispone de un plazo máximo de un mes para responder a esta solicitud.

En caso de no recibir respuesta satisfactoria, me reservo el derecho de presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).

Atentamente,
{{user_name}}',
    'RGPD Artículo 17 - Derecho de supresión',
    TRUE
);

-- Access - Spanish
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'access',
    'es',
    'Solicitud de acceso estándar',
    'Template para solicitar acceso a datos personales',
    'Solicitud de acceso a datos personales - RGPD Art. 15',
    'Estimado/a responsable de protección de datos,

En ejercicio del derecho de acceso reconocido en el artículo 15 del Reglamento General de Protección de Datos (RGPD), solicito que me proporcionen la siguiente información:

**Datos del solicitante:**
- Nombre completo: {{user_name}}
- Correo electrónico: {{user_email}}
- Fecha de la solicitud: {{date}}

**Información solicitada:**
1. Confirmación de si se están tratando o no datos personales míos
2. En caso afirmativo:
   - Copia de todos mis datos personales
   - Fines del tratamiento
   - Categorías de datos tratados
   - Destinatarios a quienes se han comunicado los datos
   - Plazo de conservación previsto
   - Origen de los datos (si no se obtuvieron de mí directamente)
   - Existencia de decisiones automatizadas, incluida la elaboración de perfiles

Según el artículo 12.3 del RGPD, disponen de un plazo máximo de un mes para responder.

Atentamente,
{{user_name}}',
    'RGPD Artículo 15 - Derecho de acceso',
    TRUE
);

-- Rectification - Spanish
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'rectification',
    'es',
    'Solicitud de rectificación estándar',
    'Template para solicitar corrección de datos incorrectos',
    'Solicitud de rectificación de datos personales - RGPD Art. 16',
    'Estimado/a responsable de protección de datos,

En ejercicio del derecho de rectificación reconocido en el artículo 16 del Reglamento General de Protección de Datos (RGPD), solicito la corrección de los siguientes datos personales inexactos:

**Datos del solicitante:**
- Nombre completo: {{user_name}}
- Correo electrónico: {{user_email}}
- Fecha de la solicitud: {{date}}

**Datos a rectificar:**
{{target_data_description}}

Adjunto documentación que acredita la información correcta.

Según el artículo 12.3 del RGPD, disponen de un plazo máximo de un mes para responder.

Atentamente,
{{user_name}}',
    'RGPD Artículo 16 - Derecho de rectificación',
    TRUE
);

-- ============================================
-- ENGLISH TEMPLATES
-- ============================================

-- Erasure (Right to be forgotten) - English
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'erasure',
    'en',
    'Standard erasure request',
    'General template for requesting deletion of personal data',
    'Personal Data Erasure Request - GDPR Art. 17',
    'Dear Data Protection Officer,

I am writing to exercise my right to erasure ("right to be forgotten") as provided by Article 17 of the General Data Protection Regulation (GDPR). I request the deletion of all my personal data held in your systems.

**Requestor information:**
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

**Data to be erased:**
{{target_data_description}}

**Legal basis:**
Under Article 17 of the GDPR, I have the right to obtain the erasure of my personal data when:
- The data is no longer necessary for the purposes for which it was collected
- I withdraw my consent and there is no other legal ground for the processing
- The data has been unlawfully processed

Please note that under Article 12(3) of the GDPR, you must respond to this request within one month.

If I do not receive a satisfactory response, I reserve the right to lodge a complaint with the relevant supervisory authority.

Yours faithfully,
{{user_name}}',
    'GDPR Article 17 - Right to erasure',
    TRUE
);

-- Access - English
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'access',
    'en',
    'Standard access request',
    'Template for requesting access to personal data',
    'Personal Data Access Request - GDPR Art. 15',
    'Dear Data Protection Officer,

Under Article 15 of the General Data Protection Regulation (GDPR), I am exercising my right of access to request the following information:

**Requestor information:**
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

**Information requested:**
1. Confirmation of whether you are processing my personal data
2. If so, please provide:
   - A copy of all my personal data
   - The purposes of the processing
   - The categories of personal data concerned
   - The recipients to whom the data has been disclosed
   - The envisaged retention period
   - The source of the data (if not collected from me directly)
   - The existence of automated decision-making, including profiling

Under Article 12(3) of the GDPR, you must respond within one month.

Yours faithfully,
{{user_name}}',
    'GDPR Article 15 - Right of access',
    TRUE
);

-- Rectification - English
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'rectification',
    'en',
    'Standard rectification request',
    'Template for requesting correction of inaccurate data',
    'Personal Data Rectification Request - GDPR Art. 16',
    'Dear Data Protection Officer,

Under Article 16 of the General Data Protection Regulation (GDPR), I am exercising my right to rectification to request the correction of the following inaccurate personal data:

**Requestor information:**
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

**Data to be rectified:**
{{target_data_description}}

I have attached documentation supporting the correct information.

Under Article 12(3) of the GDPR, you must respond within one month.

Yours faithfully,
{{user_name}}',
    'GDPR Article 16 - Right to rectification',
    TRUE
);
