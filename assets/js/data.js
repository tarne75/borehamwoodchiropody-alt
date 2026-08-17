/* ==========================================================================
   data.js — content sources for the dynamic sections
   --------------------------------------------------------------------------
   PHASE 1 (now):  every dataset below has `url: ''` and is rendered from the
                   `rows` array immediately beneath it.
   PHASE 2 (next): publish the matching Google Sheet tab to the web as CSV
                   (File > Share > Publish to web > CSV) and paste the URL into
                   `url`. main.js will fetch and parse it, and fall back to the
                   `rows` array if the fetch fails. Nothing else changes.

   The `rows` arrays are deliberately shaped like spreadsheet rows: flat
   objects whose keys are the exact column headers the sheet must use. Header
   matching in main.js is case-insensitive and order-independent.
   ========================================================================== */

window.BWC_DATA = {
  /* ---------------------------------------------------------- CONDITIONS --
     Sheet columns: name | description | category | icon | order | status
     status = "hide" removes the row.  icon = key from ICONS in main.js.      */
  conditions: {
    url: '',
    rows: [
      {
        name: 'Corns',
        description:
          'An area of skin which is exposed to pressure or friction causing a circular area of skin to form which becomes embedded in the skin and becomes painful.',
        category: 'Skin',
        icon: 'target',
        order: '10',
        status: ''
      },
      {
        name: 'Callous',
        description:
          'A sheet of skin which becomes hardened due to pressure or friction, usually on the ball or around the heels of the foot.',
        category: 'Skin',
        icon: 'layers',
        order: '20',
        status: ''
      },
      {
        name: 'Ingrowing Toenails',
        description:
          'Toe nails which become embedded in the skin, can bleed and become infected. Often caused by poor cutting of nails or trauma.',
        category: 'Nails',
        icon: 'scissors',
        order: '30',
        status: ''
      },
      {
        name: 'Heel Pain',
        description:
          'Usually plantar fasciitis, an injury to the fascia underneath the foot causing pain on standing and on rising in the morning. Can also be a bony outgrowth on the heel called a heel spur.',
        category: 'Pain',
        icon: 'pulse',
        order: '40',
        status: ''
      },
      {
        name: 'Verrucae',
        description:
          'A skin virus caught from swimming pool changing areas, gym showers or general communal areas where your feet may have been exposed to the virus, typically on flooring surfaces. Treatment consists of either cryotherapy or acid treatment — a verrucae cannot be cut out, and treatment generally takes place over a number of weeks.',
        category: 'Skin',
        icon: 'virus',
        order: '50',
        status: ''
      },
      {
        name: 'Nail Fungus',
        description:
          'Fungi that feed on keratin, a structural protein within your nails, resulting in pain, impaired ability to walk and a negative self image. We treat nail fungus by means of laser therapy, resulting in eradication of the disease in a matter of months and promoting healthy nail growth immediately following treatment.',
        category: 'Nails',
        icon: 'laser',
        order: '60',
        status: ''
      },
      {
        name: "Athlete's Foot",
        description:
          'Fungal infection of the skin which usually starts between the toes and can lead to an itchy feeling in and around the infected area. It can also cause scaling and flaking, and lead to fungal nails. Usually transmitted in moist or damp conditions where people walk barefoot, such as communal showers.',
        category: 'Skin',
        icon: 'droplet',
        order: '70',
        status: ''
      },
      {
        name: 'Pronating Foot & Collapsed Arches',
        description:
          'Also known as low arches, a common condition in adults and children. Foot arches act as a shock-absorbing spring; if they are low or collapsed that spring action is compromised. Correctable in children and adults with simple insoles or orthotics.',
        category: 'Biomechanics',
        icon: 'arch',
        order: '80',
        status: ''
      },
      {
        name: 'Thickened Nails',
        description:
          'Usually caused by trauma to the nail, either physical (such as stubbing) or chemical.',
        category: 'Nails',
        icon: 'shield',
        order: '90',
        status: ''
      },
      {
        name: 'Cracked Heels',
        description:
          'Dehydrated skin on the heel which becomes cracked and sore.',
        category: 'Skin',
        icon: 'crack',
        order: '100',
        status: ''
      },
      {
        name: 'Diabetic & Complex Foot Care',
        description:
          'General foot care advice and treatment for diabetic patients and those with complex care needs, including patients with dementia and housebound patients seen on home visits.',
        category: 'Ongoing care',
        icon: 'heart',
        order: '110',
        status: ''
      }
    ]
  },

  /* ---------------------------------------------------------------- FEES --
     Sheet columns: treatment | price | note | group | order | status
     Rows are grouped in `group` order of first appearance; the table renders
     however many rows exist, with no fixed row count.                        */
  fees: {
    url: '',
    rows: [
      { group: 'Appointments', treatment: 'New patient', price: '£40.00', note: '', order: '10', status: '' },
      { group: 'Appointments', treatment: 'Follow-up', price: '£35.00', note: '', order: '20', status: '' },
      { group: 'Appointments', treatment: 'Senior new patient', price: '£35.00', note: '', order: '30', status: '' },
      { group: 'Appointments', treatment: 'Senior follow-up', price: '£30.00', note: '', order: '40', status: '' },
      { group: 'Appointments', treatment: 'Local home visits', price: 'from £35.00', note: 'For patients unable to get to the surgery easily.', order: '50', status: '' },

      { group: 'Laser treatment', treatment: 'Laser treatment', price: '£55.00 – £85.00', note: 'Per session.', order: '60', status: '' },
      { group: 'Laser treatment', treatment: 'Laser for fungal nail', price: 'from £45.00', note: 'Single nail. £85.00 for all ten nails, usually requiring 6 treatments.', order: '70', status: '' },
      { group: 'Laser treatment', treatment: 'Laser for MSK', price: 'from £55.00', note: 'Per treatment, depending on condition.', order: '80', status: '' },

      { group: 'Verrucae', treatment: 'Verrucae treatment', price: '£40.00 – £45.00', note: 'Per treatment, depending on type of treatment.', order: '90', status: '' },
      { group: 'Verrucae', treatment: 'Child verrucae treatment', price: 'from £35.00', note: 'Per treatment.', order: '100', status: '' },

      { group: 'Nails & orthotics', treatment: 'Non-surgical removal of a single nail', price: '£45.00', note: '', order: '110', status: '' },
      { group: 'Nails & orthotics', treatment: 'Nail reconstruction', price: '£35.00', note: 'Single nail.', order: '120', status: '' },
      { group: 'Nails & orthotics', treatment: 'Orthotic assessment', price: '£45.00', note: 'Orthotics start from £65.00.', order: '130', status: '' },
      { group: 'Nails & orthotics', treatment: 'Dressing or strapping fee', price: '£20.00', note: '', order: '140', status: '' }
    ],
    notes: [
      'Full payment is required if the appointment is unattended.',
      'When booking appointments, please give as much notice as possible if you have to cancel or a fee may be charged.',
      'Home visits are for people who are unable to get to the surgery easily.',
      'These fees are reviewed annually.'
    ]
  },

  /* ---------------------------------------------------------------- FAQS --
     Sheet columns: question | answer | order | status
     Use a blank line inside the answer cell to create a second paragraph.    */
  faqs: {
    url: '',
    rows: [
      {
        question: 'What is the difference between a Podiatrist and a Chiropodist?',
        answer:
          'A Podiatrist has a broader spectrum of specialities and skills and may only specialise in one or two areas — a paediatric surgeon, for example, will operate on areas in the forefoot or biomechanics.\n\nMany Podiatrists will cover a broad spectrum of skills, will have State Registration, and will be a member of the HCPC (Health Professionals Council) and a member of the Society of Chiropodists and Podiatrists.',
        order: '10',
        status: ''
      },
      {
        question: 'How long does it take to treat a verrucae?',
        answer:
          'It depends how old the verrucae is, how many there are, what size they are, and the age of the patient. It can take from 1 month to 1 year, so be prepared to be patient.',
        order: '20',
        status: ''
      },
      {
        question: 'What is a corn?',
        answer:
          'It is a piece of hard skin which has a nucleus that becomes embedded in the skin due to pressure and friction, and becomes painful. Easily treated.',
        order: '30',
        status: ''
      },
      {
        question: 'What is a callous?',
        answer:
          'A sheet of hard skin formed around an area of pressure and friction. It can become painful. Easily treated.',
        order: '40',
        status: ''
      },
      {
        question: 'What is a verrucae?',
        answer:
          'A skin virus caught from communal damp areas such as swimming pools. It can be singular or multiple, and can be difficult to treat.',
        order: '50',
        status: ''
      },
      {
        question: 'Why are my nails thickened and discoloured?',
        answer:
          "You probably have a fungal nail infection, which can be caught from having athlete's foot — also a fungal infection.",
        order: '60',
        status: ''
      },
      {
        question: 'What is Marigold therapy?',
        answer:
          'It is a treatment based on using parts of the marigold plant, which have differing healing properties — for corns, callous, and dry cracked skin.',
        order: '70',
        status: ''
      }
    ]
  },

  /* -------------------------------------------------------- OPENING HOURS --
     Sheet columns: day | open | close | note | order | status
     Leave `open` and `close` blank for a closed day. `note` overrides both.
     Source for the phase 1 values: the practice's Google Business Profile.   */
  hours: {
    url: '',
    rows: [
      { day: 'Monday', open: '09:30', close: '17:00', note: '', order: '1', status: '' },
      { day: 'Tuesday', open: '09:30', close: '17:00', note: '', order: '2', status: '' },
      { day: 'Wednesday', open: '09:30', close: '17:00', note: '', order: '3', status: '' },
      { day: 'Thursday', open: '09:30', close: '17:00', note: '', order: '4', status: '' },
      { day: 'Friday', open: '09:30', close: '17:00', note: '', order: '5', status: '' },
      { day: 'Saturday', open: '', close: '', note: 'Closed', order: '6', status: '' },
      { day: 'Sunday', open: '', close: '', note: 'Closed', order: '7', status: '' }
    ]
  }
};
