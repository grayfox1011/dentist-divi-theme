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
| `perla-child.zip` | The child theme. It also sets the theme's colours and fonts. |
| `layouts/Perla-1-All-Pages.json` | All six page layouts, with their colours and variables. |
| `layouts/Perla-2-Theme-Builder.json` | Header, footer, blog post template and 404 page. |
| `layouts/pages/` | The same pages as single files, if you only want some of them. |

## 1. Install the child theme

1. Go to **Appearance → Themes → Add New Theme → Upload Theme**.
2. Choose `perla-child.zip`, click **Install Now**, then **Activate**.

Activating the theme sets the Perla colours and fonts in Divi. If you had already chosen your own
colours or fonts in the Theme Customizer, yours are kept.

## 2. Import the pages

1. Go to **Divi → Divi Library** and click **Import & Export**.
2. Open the **Import** tab and choose `layouts/Perla-1-All-Pages.json`.
3. Click **Import Divi Builder Layouts** and wait for the page to reload.

Six layouts named "Perla – …" now appear in your Divi Library.

## 3. Import the header and footer

1. Go to **Divi → Theme Builder**.
2. Click the **Portability** icon (two arrows) at the top right.
3. Open the **Import** tab, choose `layouts/Perla-2-Theme-Builder.json` and click
   **Import Divi Theme Builder Templates**.
4. Click **Save Changes**.

## 4. Create your pages

Repeat these steps for Home, About, Services, Dental Implants, Blog and Contact:

1. Go to **Pages → Add New**, type the title and click **Use Divi Builder**.
2. In the builder, click the **+** button at the top of the left bar and choose **Saved Layout**.
3. Open **Your Saved Layouts**, click the matching "Perla –" layout, then **Use This Layout**.
4. Click **Save**, then publish the page (in **Pages**, use *Quick Edit → Status → Published*).

Then set the home page in **Settings → Reading → A static page → Homepage: Home**.

Use these page addresses so the buttons work straight away: `/about/`, `/services/`, `/blog/`,
`/contact/`. You can change any link later in the builder.

## 5. Set up the menu

1. Go to **Appearance → Menus**, create a menu and add your pages.
2. Tick **Primary Menu** under *Display location* and save.

Until you do this, the header lists your pages automatically.

## 6. Make it yours

### Your logo

Go to **Divi → Theme Builder**, open the **Global Header**, click the Menu module and replace the
logo image. A transparent PNG about 120 px high works well (it is shown 40 px high).

### Clinic details, in one place

Open any page in the builder and open the **Variable Manager** in the left bar. Change these once
and they update in the header, the footer and every page:

- Clinic Name, Phone Number, Email Address, Address, Opening Hours
- Phone Link (`tel:+1...`) and Email Link (`mailto:...`)
- Booking Page (where the "Book a visit" buttons go)

### Colours and fonts

In the same Variable Manager you find every colour of the theme (Primary, Secondary, Heading,
Body, Dark Background, Soft Blue Background and more) and the corner radius, spacing and text
size settings. The two fonts are under **Divi → Theme Customizer → General Settings → Typography**.

Three ready-made palettes you can type in:

| Palette | Primary | Primary – Hover | Secondary | Dark Background | Soft Blue Background |
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

Open the Contact page, click the form and add the email address that should receive requests.
The form uses Divi's built-in captcha; you can connect a spam protection service in the same
panel.

### Map

On the Contact page, click the map (a Code module) and replace `Springfield,+IL` in the address
with your own, using `+` instead of spaces, for example `10+Main+Street,+Boston`.

### Service pages

"Dental Implants" is a template for a single treatment. For each service, create a new page,
load the "Perla – Service – Dental Implants" layout again and change the text. Then update the
links of the service cards on the Home and Services pages.

## Good to know

- **The header stays at the top while scrolling.** To turn this off, open the header section in
  the Theme Builder, type "sticky" in the settings search box and set the sticky position to
  *Do Not Stick*.
- **Blog cards** show your real posts. Add a featured image to each post for the best result.
- **Blog posts** do not repeat the featured image at the top. To show it, open the "All Posts"
  template in the Theme Builder and enable the image in the Post Title module.
- **Updating Divi** is safe: the layouts are standard Divi content, and newer Divi versions
  update older layouts automatically.

## Need help?

Send a message through the shop where you bought the theme. Please include your Divi version and
a screenshot of what you see.

---

Divi is a trademark of Elegant Themes, Inc. This product is not affiliated with or endorsed by
Elegant Themes.
