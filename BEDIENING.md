# bediening, foto en verf

Deze ronde vervangt de eerdere keuzes voor persoonlijke plaatjes, een aparte stickerknop, een klaarknop en het bewaren van nieuwe versleutelde fotoprojecten. De gebruiker heeft bevestigd: foto’s uitsluitend tijdelijk, zonder wachtzin.

## Interface

- Het startscherm toont tekenatelier en de drie keuzes nieuwe tekening, over een foto en mijn tekeningen. Leerkracht blijft bereikbaar via het pictogram.
- De galerij toont alle gewone tekeningen, zonder persoonlijke plaatjes of filters.
- Alle 96 themabeelden blijven beschikbaar als stempels. De aparte stickerknop en de ster-pijl-uitleg zijn verwijderd. De leerkracht bepaalt nog steeds welke thema’s en illustraties beschikbaar zijn.
- Het stempelpaneel verdeelt de beschikbare afbeeldingen plus drie vormstempels over de beschikbare ruimte. Het volledige standaardaanbod (99 knoppen) past zonder scrollen op de geteste tabletformaten. Onbeperkt eigen afbeeldingen toevoegen kan uiteindelijk tot kleinere aanraakvlakken leiden; dit is geen belofte voor een onbeperkte bibliotheek.
- Alle tien geometrische vormen staan in een compact raster zonder scrollen. Boven het blad staat bij stempelen alleen het gekozen beeld en bij selectie alleen het woord selectie.
- De kleurenbalk past zich aan landschap en portret aan. Alle zestien standaardkleuren plus zestien eigen kleuren blijven zichtbaar op de gecontroleerde formaten.
- Via het huisje worden de laatste tekengegevens eerst bewaard. Pas daarna keert de app terug naar het startscherm. De aparte klaarknop is verwijderd.
- De leerkracht kan alle gewone tekeningen selecteren, de selectie als ZIP bewaren of na één bevestiging verwijderen. Oude versleutelde projecten blijven afzonderlijk te beheren.

## Objecten en sneltoetsen

De witte greep linksboven draait rond het midden. Rechtsonder schaalt met behoud van verhouding. Beide gebruiken pointer capture en werken met één vinger of muis; annuleren van een gebaar commit geen wijziging. De selectierand blijft minimaal 72 schermpixels groot, zodat de hoekgrepen het sleepvlak van kleine objecten niet overlappen. De knoppen +, − en draaien blijven beschikbaar. Gefocuste hoekgrepen ondersteunen ook de pijltoetsen.

Ctrl+Z / Cmd+Z maakt ongedaan. Ctrl+Y en Ctrl+Shift+Z / Cmd+Shift+Z doen opnieuw. In tekstvelden en dialoogvensters wordt de eigen tekstbewerking niet onderschept. De undo-snapshot wordt vastgelegd vóórdat de actuele tekening verandert, zodat redo de juiste stap bewaart.

## Mengen en materialen

Het mengvenster start met twee vraagtekens. Elke gekozen kleur vervangt zijn eigen vraagteken. Zodra beide kleuren gekozen zijn, wacht de app 500 ms. Daarna bewegen de kleuren naar elkaar, verschijnt een ronddraaiend kleurvlak en volgt het gemengde resultaat. De animatie duurt 1200 ms; daarna kan met de kleur getekend worden. Een nieuwe keuze annuleert de oude timer. De aparte knop mengen is verwijderd. Verminderde beweging wordt gerespecteerd.

Nieuwe kwastlijnen bevatten geen druipers en gebruiken transparante multiply-overlap. Dit is een artistiek waterverfeffect, geen natuurkundige pigmentmenging. Het aparte mengvenster blijft het educatieve RYB-model gebruiken. Oude opgeslagen kwastlijnen veranderen niet: alleen nieuwe lijnen hebben het optionele `wet`-kenmerk.

Bij peninvoer wordt de gemeten druk per punt bewaard. De kwast varieert de breedte; het potlood varieert de dekking. Muis en vinger gebruiken de gekozen lijndikte en vaste dekking. Er wordt geen druk uit snelheid verzonnen. Een echte drukgevoelige pen en ondersteunende browser zijn nodig. Drukgegevens en effecten blijven bij heropenen en export behouden.

## Fotoverhouding en tijdelijke foto’s

De vaste logische verhouding van het tekenblad bepaalt nu zowel breedte als hoogte binnen de beschikbare ruimte. De fotovoorvertoning wordt proportioneel begrensd in plaats van alleen in hoogte afgekapt. De fotolaag gebruikt dezelfde coördinaten als het canvas, ook na een oriëntatiewissel. Foto’s worden passend gecentreerd; witruimte rondom een afwijkende fotoverhouding is bewust behouden.

Camera-, schaal- en verschuifbediening gebruiken pictogrammen met toegankelijke namen. Nieuwe foto’s blijven uitsluitend in het geheugen. Autosave en het huisje bewaren alleen tekengegevens. De foto komt niet in de galerij, thumbnail of PNG/JPG/PDF/ZIP. De interface biedt geen nieuw versleuteld opslaan meer. Oude versleutelde projecten blijven met hun bestaande wachtzin te openen voor herstel; het huisje vervangt ze na openen door een fotovrij project.

## Verificatie

- TypeScript en productiebuild geslaagd.
- 29 Vitest-tests geslaagd, inclusief drie tests voor proportioneel schalen, roteren en schaalgrenzen.
- 14 browserregressiecontroles geslaagd voor materialen, objecten, autosave, heropenen, mengen, leerkracht, import, alle exportformaten en tijdelijke foto’s.
- De quality-test slaagt met 96 bibliotheekafbeeldingen, snel stempelen, klein schalen en slepen, vertraagde fill-race, tabletknoppen, 500 streken, cachelimiet en blijvende bibliotheekverwijdering.
- `scripts/refinements-test.mjs`: echte browser-pointerevents voor éénvingerhoekgrepen; Ctrl+Z en beide redo-combinaties; mengfases; 99 stempelknoppen en tien vormen zonder scroll; alle 32 kleuren; fotoverhouding in voorvertoning en tekenblad; tijdelijke foto; alles selecteren. Getest op 1080×810, 1024×768, 810×1080 en 768×1024.
- Gesimuleerde pendruk bereikt het opgeslagen puntmodel. Pixelcontroles laten bij hogere druk een bredere kwast en donkerder potlood zien; overlap mengt zichtbaar en onder de lijn verschijnen geen druipers. Dit is geen vervanging voor een echte Apple Pencil-test.

Resterende praktijkcontrole: fysieke iPad 9/Safari, camera draaien tijdens opname, Apple Pencil met verschillende druk en zelfstandig gebruik door kleuters. Er zijn uitsluitend fictieve afbeeldingen gebruikt.

Aanvullend geslaagd: productie-offlineproef met alle acht stickervellen, bewaren, heropenen en PDF-export; echte vulproef met een kleine opening zonder lek of wit randje.

Ook glitteranimatie, undo van glitter en verminderde beweging zijn opnieuw gecontroleerd en geslaagd.

## Correctie 22 oktober 2026

De kwast heeft geen druipers meer. Transparante kleurmenging bij overlap blijft bestaan. Tijdens verplaatsen, schalen en draaien worden de geselecteerde vorm en alle latere tekenacties in hun oorspronkelijke volgorde weergegeven. Gumstreken en latere verflijnen verdwijnen dus niet meer tijdens het slepen. De gum blijft een bewerking op de plek op het papier waar is gegumd. Een verouderde asynchrone stempelrender kan geen nieuwere beweging overschrijven.

`eraser-move-test.mjs` vergelijkt de volledige voorvertoning pixel voor pixel met het resultaat na loslaten, voor een vorm en een stempel, bij verplaatsen, schalen, draaien en undo/redo. Geslaagd in Edge. De verfpixeltest bevestigt dat de verwijderde druiper transparant blijft en overlappende kleuren nog mengen.

## Kleurensom en gereedschapskeuzes

Het mengvenster toont de eerste kleur + de tweede kleur = de uitkomst. De invoerkleuren blijven zichtbaar tijdens en na de draaiende menganimatie. Na een complete combinatie start iedere nieuwe keuze een nieuwe ronde: de andere kleur wordt weer een vraagteken. Pas na twee keuzes start de vertraging van 500 ms.

Bij vullen kun je kleine openingen laten sluiten (standaard) of openingen volgen. Sluiten overbrugt kleine onderbrekingen, geen onbeperkt grote gaten. Bij gum kies je zelf gummen of alle tekenacties op het vel verwijderen; ongedaan maken herstelt die acties. De ondergrond blijft behouden. Het huisje staat linksboven en tekenatelier rechtsboven op het tekenblad en in de galerij.

Getest: 30 unit-tests, TypeScript en tool-options-test met beide vulmodi via de worker, leegmaken/undo, herhaald mengen en tabletindeling in landschap en portret.
