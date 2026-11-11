# Perla – Dental Clinic theme for Divi 5

Thank you for your purchase! This guide takes you from download to a finished site.
Allow about 15 minutes for the setup.

## Before you start

You need:

- A self-hosted WordPress site (not WordPress.com free plans).
- The **Divi theme, version 5.4 or newer**, installed and activated. Divi is sold separately by
  Elegant Themes and is not included in this download.

A fresh WordPress site is best. If your site already has content, back it up first.

## What is in the download

| File | What it is |
| --- | --- |
| `perla-child.zip` | The child theme. |
| `layouts/Perla-1-Design-System.json` | Colours, fonts and design variables. |
| `layouts/Perla-2-All-Pages.json` | All six page layouts in one file. |
| `layouts/Perla-3-Theme-Builder.json` | Header, footer, blog post template and 404 page. |
| `layouts/pages/` | The same pages as single files, if you only want some of them. |

## 1. Install the child theme

1. Go to **Appearance → Themes → Add New Theme → Upload Theme**.
2. Choose `perla-child.zip`, click **Install Now**, then **Activate**.

## 2. Import the design system

1. Go to **Divi → Divi Library** and click **Import & Export**.
2. Open the **Import** tab and choose `Perla-1-Design-System.json`.
3. Leave the options as they are and click **Import**.

This adds the theme's colours, fonts and variables. Do this step first, because the pages use them.

## 3. Import the pages

Repeat step 2 with `Perla-2-All-Pages.json`. The six layouts now appear in your Divi Library.

## 4. Import the header and footer

1. Go to **Divi → Theme Builder**.
2. Click the **Portability** icon (two arrows) at the top right.
3. Open the **Import** tab, choose `Perla-3-Theme-Builder.json` and click **Import**.
4. Click **Save Changes**.

## 5. Create your pages

For each page (Home, About, Services, Dental Implants, Blog, Contact):

1. Go to **Pages → Add New**, type the title and click **Use Divi Builder**.
2. When Divi asks how you want to start, choose the option to use an existing layout, open
   **Your Saved Layouts** and pick the matching "Perla –" layout.
3. Save and publish the page.

Then set the home page in **Settings → Reading → A static page → Homepage: Home**.

Use these page addresses so the buttons work straight away: `/about/`, `/services/`, `/blog/`,
`/contact/`. You can change any link later in the builder.

## 6. Set up the menu

1. Go to **Appearance → Menus**, create a menu and add your pages.
2. Tick **Primary Menu** under *Display location* and save.
3. If the header shows a different menu, open **Divi → Theme Builder → Global Header**, click
   the Menu module and choose your menu.

## 7. Make it yours

### Clinic details, in one place

Open any page in the Visual Builder and open the **Variable Manager** (the variables icon in the
left bar). Change these once and they update in the header, the footer and every page:

- Clinic Name, Phone Number, Email Address, Address, Opening Hours
- Phone Link (`tel:+1...`) and Email Link (`mailto:...`)
- Booking Page (where the "Book a visit" buttons go)

### Colours and fonts

In the same Variable Manager:

- **Colors**: Primary, Secondary, Heading, Body, Dark Background, Soft Blue Background and more.
- **Fonts**: Heading and Body.
- **Numbers**: corner radius, section spacing and text sizes.

Three ready-made palettes you can type in:

| Palette | Primary | Primary – Hover | Secondary | Dark Background | Soft Background |
| --- | --- | --- | --- | --- | --- |
| Ocean (default) | `#1a66e8` | `#114db8` | `#12b5a5` | `#081632` | `#edf4ff` |
| Mint | `#0b7f70` | `#086257` | `#1a66e8` | `#06302b` | `#e8f7f4` |
| Lavender | `#6d4de0` | `#5136b5` | `#12b5a5` | `#1a1240` | `#f1edff` |

### Photos

The layouts use light placeholder images, so nothing has to be uploaded during import. Click any
image and replace it with your own photo. Recommended sizes:

| Where | Size |
| --- | --- |
| Hero, About, Story | 960 × 1040 px (portrait) |
| Team members | 640 × 760 px |
| Before / after | 960 × 720 px, both the same size |
| Review avatars | 120 × 120 px |

### Contact form

Open the Contact page, click the form and add the email address that should receive requests
under **Content → Email**. To stop spam, keep the built-in captcha or connect a spam protection
service in the same panel.

### Map

On the Contact page, click the map (a Code module) and replace `Springfield,+IL` in the address
with your own, using `+` instead of spaces, for example `10+Main+Street,+Boston`.

### Service pages

"Dental Implants" is a template for a single treatment. For each service, create a new page,
load the "Perla – Service – Dental Implants" layout again and change the text. Then update the
links of the service cards on the Home and Services pages.

## Good to know

- **The arrows on "Learn more" links** are part of the text, so they work with any button setting.
- **The header stays at the top while scrolling.** To turn this off, open the header section in
  the Theme Builder, type "sticky" in the settings search box and set the sticky position to
  *Do Not Stick*.
- **Blog cards** show your real posts. Add a featured image to each post for the best result.
- **Updating Divi** is safe: the layouts are standard Divi content.

## Need help?

Send a message through the shop where you bought the theme. Please include your Divi version and
a screenshot of what you see.

---

Divi is a trademark of Elegant Themes, Inc. This product is not affiliated with or endorsed by
Elegant Themes.
