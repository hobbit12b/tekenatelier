# Testverslag tekenatelier

Uitgevoerd tijdens de bouw op 20 oktober 2026, op Windows met Node.js 24 en Edge/Chromium. Uitsluitend synthetische testgegevens; het algemene appicoon is als testfoto en teststicker gebruikt.

## Geslaagd

- TypeScript-controle zonder fouten.
- Vite-productiebuild en generatie van de serviceworker.
- 12 Vitest-kerntests: vijf kleurmengcontroles; acht thema's; nieuw project; afwijzen ongeldig project; publieke data zonder foto; willekeurige encryptieparameters; juiste/verkeerde/korte wachtzinnen; privéopslag zonder thumbnail; atomair vervangen van ciphertext door een afgerond publiek project; verwijderen.
- 14 browsercontroles op een venster van 1080 × 810: startscherm, tekenen/undo/redo, vijf lijndiktes, vormen plaatsen/vergroten/draaien/dupliceren, mengkleur, automatisch bewaren/heropenen, gum en export, afronden/downloaden, leerkrachtcode/acht thema's, stickerimport, fotovoorbereiding/verbergen/tonen, versleuteld opslaan zonder publieke inhoud, afronden met verwijdering van foto/ciphertext/undo, geen JavaScript-browserfouten.
- PNG en JPG zijn byte-identiek met en zonder een extra fotoattribuut op het aangeleverde project; thumbnails zijn eveneens identiek. PDF en ZIP worden daadwerkelijk gegenereerd. Export gebruikt in de implementatie uitsluitend de expliciete Drawing-allowlist en tekenrenderer.
- Visuele inspectie van het startscherm en tekenblad op iPad-afmetingen. De knoppen voor kleuren en lijndikte zijn op tabletformaat vergroot naar 56 × 56 pixels.
- Productie onder `/tekenatelier/`: serviceworker geïnstalleerd, browser offline gezet en herladen; tekenen, mengen, afronden, opslaan, galerij heropenen en PDF downloaden geslaagd. De cache bevat uitsluitend de 12 algemene productie-appbestanden.

De automatische browserbestanden zijn `scripts/browser-test.mjs` en `scripts/offline-test.mjs`. Screenshots en tijdelijke testresultaten staan lokaal onder `test-results/` en worden niet gepubliceerd.

## Speelse vormgeving en glitter

Na de eerste versie is de vormgeving aangepast aan het aangeleverde moodboard: krijtillustraties, een gekleurde naam, papieren kaarten, geïllustreerde materialen links en grote objectknoppen rechts. De afbeeldingen zijn met de ingebouwde ImageGen-tool gemaakt en worden lokaal gebundeld. Promptbeschrijvingen en bestanden staan onder `public/art/`.

De glitterpen bevat nu statische vierpuntsterren in de tekenlaag en een onafhankelijke animatielaag met maximaal 260 bestaande sterretjes plus maximaal 70 tijdens een streek. De animatie ververst maximaal twintig keer per seconde, pauzeert in verborgen tabbladen en respecteert verminderde beweging. De export blijft stilstaand. De browsercheck `scripts/sparkle-test.mjs` bevestigt zichtbare verandering tussen frames, verdwijnen na undo en stilstand met verminderde beweging. Vier extra kerntests controleren ruimtelijke verdeling, limiet, spiegeling en afwezigheid bij gewone lijnen.

## Nog fysiek controleren

Een echt iPad 9-apparaat, Safari/iPadOS, vingersnelheid, tweevingergebaren, voor-/achtercamera, de native deelkaart en Bestanden-app zijn niet fysiek getest. De README bevat een concrete testprocedure. Browserautomatisering op Windows vervangt deze controles niet. Ook gedrag bij OS-back-ups, geforceerd afsluiten, verwijderde browseropslag en bijna volle iPad-opslag vraagt apparaatcontroles.

## Nog aan te leveren

De professionele themastickers zijn niet meegeleverd. De acht volledige catalogi, import, selectie, plaatsing, schaal/rotatie en opslag zijn aanwezig. Geef per thema bij voorkeur minimaal acht passende illustraties met een transparante achtergrond. De optionele themaopdrachten zijn voorlopig tekstueel. Dit is dus een werkende technische versie; de professionele illustratiecollectie en fysieke iPad-acceptatie zijn nog nodig voor volledige afronding van de oorspronkelijke bouwopdracht.

## Vergevingsgezind vullen en bijpassende pictogrammen

Kleine onderbrekingen (circa 10 tekenpixels) worden in het detectiemasker gesloten; de zichtbare lijn blijft intact. De vulkleur vervangt ook de achtergrondbijdrage van zachte randpixels om witte naden te verminderen. Vier extra kerntests controleren kleine/grote openingen, de antialiasrand en een leeg blad. `scripts/fill-test.mjs` controleert een echte canvaslijn met een opening en de aansluiting van de vulling.

Alle actieknoppen gebruiken nu de krijtillustraties uit `public/art/actions.png`, inclusief vullen, mengen, home, vormen, stickers, stempels, tekst, geschiedenis en dialoogknoppen. De zes bestaande materiaalillustraties blijven behouden.

## Verbeteringsronde 21 oktober 2026

Dit historische verslag wordt aangevuld door `VERBETERINGEN.md`, met de actuele 26 kerntests, 15 regressiecontroles, aanvullende touch-/race-/stickercontroles en de tablet- en offlinecontrole. Twaalf gegenereerde herfststickers zijn inmiddels aanwezig; de resterende beeldbestanden staan precies in `ILLUSTRATIES.md`. De eerdere vermelding dat alle themastickers ontbreken geldt dus voor de oorspronkelijke versie.

## Aanvulling 21 oktober: acht stickercollecties

96 stickers (12 per thema), alle PNG-uitsneden gedecodeerd en op transparantie gecontroleerd; overzicht visueel beoordeeld. TypeScript, productiebuild, quality-test en offline-test geslaagd. Offlinecontrole laadt alle acht stickervellen en exporteert een heropend werk als PDF. Testoverzicht: scripts/sticker-collections-test.mjs. Testserver was aanvankelijk onbereikbaar vanuit de browser; na herstart buiten de sandbox slaagden de controles. Geen fysieke iPad-test uitgevoerd.

## Bediening, foto en verf

Zie BEDIENING.md voor de nieuwe gebruikerskeuzes en scripts/refinements-test.mjs voor de regressieproef. TypeScript, productiebuild, 29 Vitest-tests, 14 browserchecks, quality-test, offlineproef en fill-test geslaagd. De nieuwe proef controleert hoekgrepen met touch, Ctrl+Z en redo, automatisch mengen, 99 stempelknoppen zonder scroll, tien vormen, alle 32 kleuren, fotoverhoudingen bij draaien, tijdelijke foto, alles selecteren en pendruk. Nieuwe screenshots staan in test-results. Geen fysieke iPad- of Apple Pencil-test uitgevoerd.

### 22 oktober: gum en kwast

Geslaagd: 29 unit-tests, TypeScript, productiebuild, eraser-move-test (stempel/vorm, verplaatsen/schalen/draaien, voorvertoning versus definitieve pixels, undo/redo), refinements-test en productie-offlineproef. Druiperpixel heeft alfa 0; overlapmenging blijft zichtbaar.
