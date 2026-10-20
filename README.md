# tekenatelier

Een lokale tekenapp voor groep 1–2, gemaakt voor liggend gebruik op een iPad. De appnaam is altijd **tekenatelier**. Geen backend, accounts, analytics, advertenties, externe afbeeldingen tijdens gebruik of cloudopslag van projecten.

## Starten en bouwen

Gebruik Node.js 24 en pnpm 11.25.0:

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm preview
```

Open de URL die Vite toont. Open niet rechtstreeks `index.html` via de bestandsverkenner: de app heeft HTTP of HTTPS nodig. Voor camera, encryptie en PWA is HTTPS nodig, of localhost tijdens ontwikkeling.

De productieversie staat in `dist/`. De relatieve Vite-basis, manifest-URL's en serviceworker ondersteunen `/tekenatelier/` en andere repository-subpaden. De GitHub Actions-workflow bouwt en test op `main` en publiceert met GitHub Pages. Kies bij **Settings → Pages → Build and deployment → Source** zo nodig **GitHub Actions**. Er worden uitsluitend algemene broncode en appbestanden gepubliceerd.

## Op de iPad

1. Open de gepubliceerde HTTPS-URL in Safari.
2. Wacht tot op het startscherm **klaar voor offline tekenen** verschijnt.
3. Gebruik Delen → Zet op beginscherm.
4. Open het beginschermicoon en controleer eenmaal met vliegtuigmodus of het atelier opent.

Updates worden pas actief wanneer de oude appvensters gesloten zijn. Projecten staan apart in IndexedDB en worden niet door een appupdate verwijderd. Browseropslag is geen gegarandeerd archief: Safari, het besturingssysteem of apparaatbeheer kan deze verwijderen. Exporteer belangrijk werk regelmatig.

## Tekenen

- Kies **nieuwe tekening**, **over een foto** of **mijn tekeningen**.
- Links staan potlood, stift, kwast, wasco, glitter, gum, verfemmertje en objectgereedschappen. Onderin staan vijf lijndiktes en zestien kleuren met huidtinten.
- **mengen** gebruikt een educatief RYB-kleurmodel: geel en blauw geven groen, rood en geel oranje, rood en blauw paars. Wit maakt lichter, zwart donkerder. Dit is een begrijpelijk leermodel, geen natuurkundige pigmentsimulatie.
- Gemengde kleuren blijven in het project bewaard. De laatst gemaakte zestien eigen kleuren zijn beschikbaar.
- Plaats vormen, tekst of stickers. Kies het pijltje om objecten later opnieuw te selecteren en te verplaatsen. Gebruik +, −, draaien, dupliceren en verwijderen. Twee vingers schalen/draaien een geselecteerd object.
- Bij vormen wisselt het emmertje in de objectbalk tussen een gevulde vorm en een buitenlijn.
- Stempels kunnen herhaald worden afgedrukt. Er zijn eenvoudige geometrische vormstempels; geïmporteerde themastickers zijn ook als stempel beschikbaar.
- Boven het blad staan spiegeltekenen, zes achtergronden en opnieuw afspelen. Afspelen toont alleen tekengegevens, nooit de foto.
- Gewone tekeningen worden 900 ms na een wijziging automatisch lokaal bewaard. De laatste 40 bewerkingen kunnen ongedaan worden gemaakt tijdens de tekenbeurt. Deze tijdelijke geschiedenis wordt niet opgeslagen.

## Leerkrachtomgeving

Open **leerkracht** op het startscherm. Bij het eerste gebruik stel je een code van minimaal vier tekens in. Daarna is de code vereist. Deze code is een bedieningsafscherming, geen cryptografische bescherming van fotoprojecten.

Er zijn acht thema's: herfst in het heksenbos, sinterklaas, kerst, piraten, restaurant, sprookjes, kriebelbeestjes en winter. Combineer thema's door meerdere vakjes aan te zetten. Importeer PNG- of WebP-stickers en kies per sticker of kinderen die mogen gebruiken. Je kunt stickers bekijken, hernoemen en verwijderen. Een verwijderde bibliotheeksticker blijft behouden in tekeningen waarin deze al geplaatst is.

Onder instellingen kies je de gereedschappen, liggend A4 of een vierkant tekenblad, een zacht afrondingsgeluid en een optionele themaopdracht. Instellingen blijven lokaal. Projectbeheer toont ook versleutelde fotoprojecten, die nooit in de kindergalerij staan. Ontgrendel, hervat of verwijder ze hier. Voor afronden open je het project en kies je **klaar!**. Gewone tekeningen kunnen samen als ZIP met PNG's worden geëxporteerd.

## Foto's en privacy

De camera wordt pas aangevraagd na een tik op **open camera**. Voor- en achtercamera zijn beschikbaar wanneer het apparaat ze ondersteunt. **kies foto** biedt lokale JPG/PNG/WebP-invoer als alternatief; iPadOS kan daar ook een cameraoptie aanbieden. Streams stoppen na de opname, sluiten of opnieuw openen. De foto kan vóór tekenen worden geschaald en horizontaal/verticaal verschoven; de randen van het blad begrenzen de uitsnede. Daarna is de fotolaag vergrendeld.

Foto's worden lokaal opnieuw gecodeerd en zo nodig verkleind tot maximaal 1800 pixels aan de langste zijde. Dit verwijdert bestandsmetadata en beperkt geheugengebruik. Er is geen upload. De foto blijft normaal alleen in geheugen. Het oog verbergt de foto zonder te verwijderen. Met de transparantieregelaar wordt de foto lichter.

Wil je later verdergaan? Gebruik het slotje bovenaan en geef de leerkrachtcode. Kies vervolgens een sterke projectwachtzin van minimaal zestien tekens, bij voorkeur meerdere willekeurige woorden. Het volledige project inclusief foto wordt versleuteld met AES-GCM-256. PBKDF2-SHA-256 gebruikt 600.000 iteraties en een nieuwe willekeurige salt van 16 bytes en IV van 12 bytes per opslag. De wachtzin en ontgrendelingssleutel worden niet persistent bewaard. Verlies van de wachtzin betekent verlies van de bewaarde foto.

Bij **klaar!** en bevestigen wordt het IndexedDB-record in één afgeronde transactie vervangen door uitsluitend tekengegevens en een fotovrije thumbnail. Pas daarna worden de foto-onderlaag en undo/redo-geheugen verwijderd en volgt de succesmelding. Een opslagfout laat het oorspronkelijke project intact voor een nieuwe poging. Export en thumbnails bouwen altijd vanuit de niet-fotolagen; er is geen fotoargument in de export-API.

Een browser kan geen forensische verwijdering bewijzen: apparaatback-ups, geheugenbeheer en fysieke toegang tot een ontgrendelde iPad blijven aandachtspunten. `beforeunload` waarschuwt waar mogelijk bij niet-bewaard werk, maar iPadOS kan een app beëindigen zonder deze waarschuwing. Maak op school afspraken over toestemming of een andere passende grondslag, wie mag fotograferen, gedeeld apparaatgebruik, bewaartermijnen en tijdig verwijderen. Importeer alleen algemene illustraties in de stickerbibliotheek; gebruik leerlingfoto's uitsluitend via de aparte fotofunctie.

## Export

Na afronden zijn PNG, JPG en een afdrukbare A4-PDF beschikbaar. Rasterexport is 3508 pixels breed; verhouding en achtergrond blijven behouden. De originele foto, selectieomranding en spiegelhulplijn worden nooit geëxporteerd. **delen / bestanden** gebruikt het apparaatdeelmenu als dat bestanden ondersteunt; anders volgt een download. Als een browser delen na de exportberekening weigert, gebruik dan de aparte downloadknoppen. Op de iPad kun je bestanden in Bestanden bewaren; voor Windows kies je zelf een door school toegestane overdrachtsmethode.

## Professionele illustraties toevoegen

Er zijn bewust geen generieke emoji of namaakfiguren als themastickers geleverd. De acht catalogi met gewenste illustraties staan in `src/model.ts`; de bibliotheek werkt met eigen geïmporteerde illustraties. Lever voor de visuele eindversie bij voorkeur minimaal acht samenhangende kinderboekillustraties per thema aan, als transparante PNG/WebP van circa 800–1200 pixels. De startkaarten gebruiken eenvoudige papieren interfaceillustraties; deze zijn geen themastickers.

Voor algemene, meegeleverde stickers:

1. Plaats bestanden in `public/stickers/<thema>/`.
2. Voeg entries toe aan `public/stickers/manifest.json`:

```json
{"id":"herfst-egel-v1","name":"egel","theme":"herfst","src":"./stickers/herfst/egel.png","enabled":true}
```

3. Bouw en publiceer opnieuw. Bij eerste opening worden deze stickers in de lokale bibliotheek opgenomen. Gebruik een nieuw ID voor een nieuwe versie van een eerder geïmporteerde illustratie.

Import accepteert alleen PNG/WebP-stickers tot 12 MB. Foto's mogen daarnaast JPG zijn. Afbeeldingen worden gedecodeerd en lokaal opnieuw gecodeerd; SVG, HTML en andere uitvoerbare inhoud worden niet geaccepteerd. Te grote rasterafmetingen worden geweigerd. Serviceworker-caching is beperkt tot een bij de build gegenereerde lijst algemene appbestanden.

## Architectuur en grenzen

React/TypeScript/Vite voor interface en builds; Canvas 2D voor tekenmaterialen en compositing. Een eigen gestructureerd objectmodel maakt tekenwerk bewerkbaar en houdt de foto buiten de tekenengine. IndexedDB voor projecten, instellingen en stickers. De vulfunctie gebruikt een begrensde queue en kleurtolerantie. Export wordt op een afzonderlijk canvas op hogere resolutie opgebouwd. Geen CDN-afhankelijkheden tijdens gebruik.

Bestanden zijn verdeeld over model, tekenengine, canvas-interactie, export, bestandeninvoer, encryptie/opslag, camera, leerkrachtomgeving en interface. In deze eerste versie zijn de creatieve opdrachtkaarten tekstueel; geïllustreerde opdrachtkaarten en professionele themastickers moeten nog worden aangeleverd. Flood-fill en het opnieuw renderen van zeer grote tekeningen draaien op de hoofdthread: prestaties op een fysieke iPad 9 moeten nog worden gemeten. Er is nog geen versleutelde projectback-up/import buiten de browser; export levert afgeplatte kunstwerken. Cameragedrag, delen en OS-opslagbeheer verschillen per iPadOS-versie.

## Tests en fysieke iPad-controle

Zie `TESTVERSLAG.md` voor daadwerkelijk uitgevoerde controles. Kerntests: `pnpm test`. De browsercheck gebruikt Playwright met lokaal geïnstalleerde Edge: start `pnpm dev --port 5174`, installeer desgewenst Playwright als ontwikkeltool en voer `node scripts/browser-test.mjs` uit. Er worden uitsluitend synthetische testgegevens en het algemene appicoon als testfoto gebruikt.

Controleer vóór inzet in de klas op een fysieke iPad 9:

1. Safari en de beginscherm-PWA, in landschap en portret. Geen scrollen of paginazoom tijdens tekenen.
2. Snelle vingerlijnen met elk materiaal en vijf diktes, gum, spiegel, gesloten vlakken vullen, 500+ streken.
3. Stickers plaatsen, slepen, met twee vingers schalen/draaien, +/−, dupliceren, heropenen.
4. Camera voor/achter, toestemming weigeren, alternatief via Bestanden, opnieuw nemen, schaal/positie en transparantie.
5. Foto verbergen/tonen, versleuteld bewaren, app volledig sluiten, verkeerde en juiste wachtzin.
6. Afronden: geen foto in galerij, thumbnail, undo, PNG, JPG, PDF of ZIP. Kijk ook naar een eerder versleuteld opgeslagen project.
7. Vliegtuigmodus na volledige installatie: openen, tekenen, mengen, stickers, bewaren, heropenen, camera en alle exports.
8. Export naar Bestanden, deelmenu, A4-afdruk en ZIP openen op Windows.
9. Opslag vol of ontoegankelijk: foutmelding, nooit een onterechte succesmelding. Controleer ook wat er gebeurt bij geforceerd afsluiten.

Gebruik geen leerlingfoto's voor ontwikkeling of automatische tests.
