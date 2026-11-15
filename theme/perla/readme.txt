=== Perla ===
Contributors: grayfox86
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A bright, friendly block theme for dental clinics and other small health practices.

== Description ==

Perla gives a dental clinic, an orthodontist or any small health practice a complete website made only of core blocks.

The home page is ready as soon as the theme is active: a hero with opening hours, phone number and address, treatment cards, a "how we work" section, the steps of a first visit, a before and after slider, the team, reviews, the latest posts, frequent questions and a booking banner.

For the other pages, Perla adds fifteen page patterns. Create a new page and WordPress offers them to you: Home, About, Team, Reviews, Treatments, six single treatments (Dental Implants comes with a price table), Prices, First visit, Questions and Contact. Twenty-five sections are also available on their own in the inserter, under "Perla sections", together with two headers and two footers.

Colours, fonts and every text can be changed in the Site Editor. Nothing needs a plugin.

Sections appear with gentle animations as the visitor scrolls. They can be switched off in Appearance > Customize > Animations, and they never run for visitors who ask their device for reduced motion.

== Installation ==

1. In your admin panel, go to Appearance > Themes and click "Add New Theme".
2. Search for "Perla", or click "Upload Theme" and choose the zip file.
3. Click "Install", then "Activate".

= After activating =

1. The home page is already there. You can change it in two ways. In Appearance > Editor > Templates > Front Page; or, if you prefer to edit it like any other page, create a page, choose the "Home" pattern and select that page as the homepage in Settings > Reading. From then on the front page shows your page.
2. Create the other pages in Pages > Add New Page. Choose a pattern when WordPress offers them, or open the inserter and look under Patterns > Perla pages. The buttons and menus of the theme point to these addresses, so the links work without further changes when your pages use them:
   * /about/, /team/, /reviews/
   * /services/ (and the treatments as child pages: /services/general-dentistry/, /services/cosmetic-dentistry/, /services/dental-implants/, /services/teeth-whitening/, /services/orthodontics/, /services/emergency-care/)
   * /prices/, /first-visit/, /faq/
   * /contact/
   * /blog/
   * /privacy-policy/ and /terms/
3. For the blog, create an empty page called "Blog" and choose it as "Posts page" in Settings > Reading.
4. Phone number, address and opening hours are in the header and in the footer: Appearance > Editor > Patterns > Header and Footer.

== Frequently Asked Questions ==

= How do I change the colours and the fonts? =

Appearance > Editor > Styles. The palette has eleven named colours: change "Primary" and every button, link and icon follows.

= How do I change an icon? =

The icons are small images. Select one and click "Replace". The blue square behind it is added by the theme and follows the Primary colour. White drawings on a transparent background work best.

= How does the before and after slider work? =

It is a Group block with two Image blocks inside: the first is the "before" picture, the second the "after". Replace the two images with your own, ideally of the same size, and change the captions if you like. On the site visitors drag the handle, or move it with the arrow keys. To make your own, give any Group with two images the CSS class perla-compare.

= Where are the photos of the team? =

"Team with photos" shows a placeholder for each portrait: select it and click "Replace". The other team section shows coloured panels with initials, for practices that prefer no photos.

= Is there a contact form? =

No. WordPress.org asks themes to leave forms to plugins. The Contact pattern has two buttons (call and write); replace them with the block of the form plugin you prefer.

= How do I switch off the animations or the smooth scrolling? =

Appearance > Customize > Animations. There is one switch for the animations and one for the smooth scrolling with the mouse wheel.

= Can I animate my own blocks? =

Yes. Select a block, open Advanced > Additional CSS class(es) and add one of these: perla-reveal (fades in and rises), perla-stagger (the inner blocks appear one after the other), perla-split (the words of a title rise one by one), perla-image (a picture settles into place), perla-pop (a panel grows into place). Two more classes hide a block on small screens: perla-hide-medium (tablets and phones) and perla-hide-small (phones).

= I chose a page as my homepage. What does the front page show? =

Your page, as soon as it has some content. While it is empty, the front page keeps showing the ready-made home of the theme, so the site never looks unfinished.

== Changelog ==

= 1.0.0 =
* Initial release.

== Copyright ==

Perla WordPress Theme, (C) 2026 Fontana Jonathan
Perla is distributed under the terms of the GNU GPL.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

== Resources ==

Perla bundles the following third-party resources.

= Fonts =

Inter (variable), (C) 2016 The Inter Project Authors
License: SIL Open Font License 1.1, https://openfontlicense.org
Source: https://github.com/rsms/inter
Files: assets/fonts/inter-latin-wght-normal.woff2, assets/fonts/inter-latin-ext-wght-normal.woff2

Plus Jakarta Sans (variable), (C) 2020 The Plus Jakarta Sans Project Authors
License: SIL Open Font License 1.1, https://openfontlicense.org
Source: https://github.com/tokotype/PlusJakartaSans
Files: assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2, assets/fonts/plus-jakarta-sans-latin-ext-wght-normal.woff2

The full text of each licence is in assets/fonts.

= JavaScript =

Lenis 1.3.27, (C) 2024 darkroom.engineering
License: MIT, https://github.com/darkroomengineering/lenis/blob/main/LICENSE
Source: https://github.com/darkroomengineering/lenis
File: assets/js/lenis.js (the unminified build of the package, without the reference to its source map)

= Photographs =

All photographs are released under Creative Commons CC0 (https://creativecommons.org/publicdomain/zero/1.0/). They were cropped and resized for the theme.

hero.jpg
Source: https://pxhere.com/en/photo/917219

teeth-whitening.jpg, smile-after.jpg, smile-before.jpg
Source: https://pxhere.com/en/photo/496715
smile-before.jpg is the same photograph with the teeth darkened, as an illustration for the before and after section. It is not a clinical case.

studio.jpg
"Chair Dentist" by Daniel Frank
Source: https://stocksnap.io/photo/chair-dentist-3J10QN5PTS

chair.jpg
"Dentist Surgery chair"
Source: https://www.rawpixel.com/image/5927111/photo-image-public-domain-medicine-beauty

general-dentistry.jpg
"Free toothbrush toothpaste image"
Source: https://www.rawpixel.com/image/5921240/photo-image-public-domain-blue-free

cosmetic-dentistry.jpg
"Close dental cast dentist's hand"
Source: https://www.rawpixel.com/image/5971640/photo-image-person-brush-doctor

dental-implants.jpg
"Dentist tool"
Source: https://www.rawpixel.com/image/5904418/dentist-tool-free-public-domain-cc0-photo

orthodontics.jpg
"Orthodontic Retainers"
Source: https://www.rawpixel.com/image/6039077/photo-image-public-domain-free

emergency-care.jpg
"Free dentist lamp image"
Source: https://www.rawpixel.com/image/5925133/free-dentist-lamp-image-public-domain-cc0-photo

The photograph of hero.jpg also appears in screenshot.png.

= Icons =

The icons and the portrait placeholder in assets/images (icon-*.svg, portrait.svg) were drawn for this theme.
License: GNU General Public License v2 or later, like the theme.
