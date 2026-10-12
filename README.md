# martinsucker.de

Persönliche Webseite von Martin Sucker, IT-Consultant für End User Computing und Cloud (Citrix, Microsoft Azure).

Die Seite ist statisch: HTML, CSS und JavaScript ohne Build-Schritt, ohne Abhängigkeiten und ohne externe Ressourcen.

Live: https://www.martinsucker.de

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Hauptseite |
| `og-image.png` | Vorschaubild für Link-Vorschauen (1200×630) |
| `apple-touch-icon.png` | Icon für den iPhone-Homescreen (180×180) |
| `games/` | Browsergames, auswählbar über das Dropdown im Footer der Hauptseite |
| `CNAME` | Eigene Domain für GitHub Pages, enthält nur `www.martinsucker.de` |

## Veröffentlichen mit GitHub Pages

1. Alle Dateien ins Hauptverzeichnis des Repos legen.
2. Unter **Settings → Pages** als Quelle den Branch `main` und den Ordner `/ (root)` wählen.
3. Die Datei `CNAME` mit dem Inhalt `www.martinsucker.de` anlegen.
4. Beim Domain-Anbieter einen CNAME-Eintrag für `www` auf `dersucker.github.io` setzen.
5. Unter **Settings → Pages** die Option **Enforce HTTPS** aktivieren.

## Anpassen

- **Farben:** CSS-Variablen am Anfang von `index.html` (`:root` für Darkmode, `:root[data-theme="light"]` für Lightmode)
- **Inhalte:** direkt im HTML unter den Abschnitten Kurzprofil, Kernkompetenzen, Branchenerfahrung, Werdegang, Themen, Zertifizierungen und Kontakt
- **Kontaktformular:** Link zu Microsoft Forms, im Abschnitt Kontakt und im Impressum

## Hinweise

- Die Seite setzt keine Cookies und lädt keine Schriften oder Skripte von Drittanbietern.
- Impressum und Datenschutzerklärung sind Vorlagen und keine Rechtsberatung. Bitte vor der Veröffentlichung prüfen.

## Autor

Martin Sucker | [github.com/DerSucker](https://github.com/DerSucker)
