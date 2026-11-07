# pl-it-wymowa

Słownik polskiej wymowy nazw informatycznych, firm i technologii. Ma pomagać
transkrypcji w trybie programisty w Handy.

## Pliki

- `wymowa-it-pl.tsv`: termin angielski, zapis fonetyczny po polsku, kategoria.
  Około 130 pozycji.

## Źródła i licencje

Przeszukałem GitHub. Nic z poniższego nie jest w tym repozytorium.

| Projekt | Licencja | Status |
| --- | --- | --- |
| NeonFeline/TBenni (polski G2P, reguły) | Apache-2.0 | tylko do wglądu, nie kopiowany |
| vitalxp/polish-minimal-pairs (pary minimalne) | CC BY 4.0 | tylko do wglądu, nie kopiowany |
| gooselinux/hunspell-pl | brak licencji w repozytorium | nie użyte |

Zasada: dane na licencji GPL (i inne nie-MIT) dołączamy tylko po zgodzie użytkownika.

## Licencja zawartości

Zapisy w `wymowa-it-pl.tsv` napisałem na potrzeby tego projektu. Licencja do
ustalenia przed publikacją (propozycja: MIT, jak w Handy).

## Mechanizmy poprawy wymowy w Handy

1. Zamiany całych słów w trybie programisty (`pl-dev/zamiany-programisty.tsv`).
2. Idiomy PL → EN (`pl-dev/idiomy-pl-en.tsv`), najdłuższa fraza wygrywa.
3. Słownik technologiczny i skróty jako podpowiedzi rozpoznawania (własne słowa).
4. Reguły poprawności polskiej (`pl_correct`), po zgodzie na słownik sjp.pl.

Plan dalszy: zapis fonetyczny z tego pliku jako źródło dla zamian (po przeglądzie).
