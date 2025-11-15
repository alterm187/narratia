**Job Story 1:** Narratia Look&Feel

*   **Job Story:**
    **Co do zrobienia:**
      * dostosowanie wielkości czcionek na wszystkich podstronach
      * sprawdzenie responsive design na różnych typach urządzeńu i są dostosowane do responsive design
    **Dlaczego:**
      * strona ma być gotowa do publikacji
      * strona ma być czytelna i realizować swoje cele marketingowe wyglądem i UXem

**User Story 4:** SEO preparations before publishing page

*   **User Story:**
    **Jako** twórca strony narratia.pl, **chcę** mieć kontent związany z SEO wygenerowany i wszystkie akcje dotyczące SEO wykonane, **abym** mógł opublikować stronę w kompletnej gotowości SEO, która zapewni pełną realizację celów marketingowych.

*   **Status: ✅ COMPLETED**

*   **Implementation Summary:**
    * ✅ Dynamic XML sitemap (`/app/sitemap.ts`) - includes all pages (homepage, books, blog, about, contact, fragmenty) in both languages
    * ✅ Robots.txt (`/app/robots.ts`) - proper crawling directives with sitemap reference
    * ✅ Meta tags verified on all pages - title, description, Open Graph, Twitter Cards, canonical URLs, hreflang
    * ✅ Structured data (JSON-LD Schema.org):
      - Book schema on all book pages
      - Author schema on about page
      - Article/BlogPosting schema on all blog posts
    * ✅ Middleware fixed to allow sitemap.xml and robots.txt access
    * ✅ Comprehensive documentation created: `SEO_IMPLEMENTATION_SUMMARY.md`
    
*   **Note:** Consider creating a branded default Open Graph image (`/public/og-image.jpg`, 1200x630px) before launch. Pages with specific images (books, blog posts) already have proper OG images.

*   **See:** `SEO_IMPLEMENTATION_SUMMARY.md` for complete details, testing checklist, and post-deployment recommendations.


**User Story 5:** Narratia webpage - ARC redirections

*   **User Story:**
    **Jako** autor prezentujący swoje książki na stronie Narratia, **chcę** mieć możliwość pozyskiwania ARC (reviews) od czytelników, **abym** mógł dzięki temu zyskiwać lepszą widoczność moich książek i wyższą sprzedaż.

*   **Status: to be refined**
    * niekoniecznie ARC reviews powinny być robione na stronie narratia.pl
    * może potrzebny jest tylko system zachęt do robienia reviews na amazon.com albo goodreads.com
    * potrzebne są pomysły jak wykorzystywać kwestię ARC, może tylko ogłoszeniowo, że jest kampania ARC gdzie można książki dostać?


**User Story 6:** Narratia webpage - ecommerce

*   **User Story:**
    **Jako** autor prezentujący swoje książki na stronie Narratia, **chcę** mieć możliwość sprzedaży ebooków wprost przez tą stronę, **abym** nie musiał ponosić opłat dystrybucyjnych i dał lepsze ceny czytelnikom.

*   **Kryteria Akceptacji:**
    *   AC1: Możliwość zkupu ebooków z watermarkiem
    *   AC2: Możliwość zakupu polskiej wersji Luster z wysyłką (do potwierdzenia czy na pewno chcę; trzeba rozważyć kwestie przetwarzania danych osobowych i dostępności mojego numeru telefonu przy wysyłce)

**Job Story 5:** Security review and fixes

*   **Job Story:**
    **Co do zrobienia:**
      * /security-review z użyciem Claude Code
      * fixing
    **Dlaczego:**
      * rozwiązania muszą być bezpieczne


**Job Story 6:** Security scanning introduction in Narratia project

*   **Job Story:**
    **Co do zrobienia:**
      * skopiowanie rozwiązań skanujących z ascendo-analytics
      * uruchomienie skanów i wyprowadzenie podatności
    **Dlaczego:**
      * rozwiązania muszą być bezpieczne