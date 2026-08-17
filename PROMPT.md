I want to clone, modernise, freshen-up and standardise https://www.borehamwoodchiropody.co.uk to the local filesystem, ready to be pushed to GitHub pages for hosting. The current site styling feels old and outdated. I want to retain the same sections, wording and general content from the original site, but perhaps shuffle things around a bit.

Keep the current palette and imagery, but use hand-written modern CSS to get the Stripe/Linear feel with a single small stylesheet — the website must be "fast loading". I want the new site to be static HTML, one stylesheet, one vanilla main.js, Google Fonts. Use modern platform features — <dialog> for the lightbox (native focus trap and Esc, no JS library), IntersectionObserver for reveals and scrollspy, CSS custom properties, clamp() fluid type, color-mix(), svh units. Zero dependencies. I think a “single page” website will work nicely here, with the Navigation options in the header to resolve to anchor links (see https://tarne75.github.io/thebarberguys-alt/ as an example).

The header should always remain visible when scrolling, so the logo, email, Tel numbers and navigation links are always visible. I don’t have a logo for the new site yet, but I’m happy for you to create one that matches the look and feel.

While the site will remain static, some of the data will be eventually be sourced from Google Sheets (as dynamically loaded csv), for the ‘conditions treated’, fees and FAQ. For phase 1, hardcode the values in javascript, but in phase 2 we will embed the actual urls to the Google Sheet, so consider setting phase 1 up with the same core libraries as used in karatekidshemel.co.uk or pottersbargarage.co.uk. Both of these sites load data from Google Sheets).

The section for ‘Conditions Treated’ section, the sections should load in a dynamically laid out grid, perhaps 3 columns per row. See https://pottersbargarage.co.uk/vehicles.html for an example of this being done for other dynamically loaded data, with 2 columns per line. For fees, I want the table rendered based on how many data points there are - an example of this kind of thing can be seen at https://karatekidshemel.co.uk/diary.html

The Contact page should use https://formspree.io (https://formspree.io/f/xwvndkow is the POST url). It should be structured more like https://pottersbargarage.co.uk/contact.html that includes a visually nicer layout, with a Google map underneath.

Once finished, write CLAUDE.md explaining what’s been done. Write palette, branding and style details to BRAND.md.
