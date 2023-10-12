export const mailTemplate = (activationCode: string) => {
  const template = `
        <html>
           <head>
                <meta charset="UTF-8" />
                <title>Aktywacja konta</title>
            </head>
          <body>
            <p>
              <strong>Użytkowniku,</strong>
            </p>
            <p>Dziękujemy za rejestrację na naszej platformie. Aby dokończyć proces rejestracji i aktywować swoje konto, proszę wprowadzić poniższy kod aktywacyjny na stronie aktywacji konta.
            
            <p><strong>Twój KOD AKTYWACYJNY: </strong>${activationCode}</p>
            <p>Jeśli to nie Ty utworzyłeś/aś konto z tego adresu e-mail, prosimy o kontakt z naszym zespołem obsługi klienta pod adresem <a href="mailto:kontakt@dev-olczak.pl">Wyślij e-mail.</a></p>
            <p>Dziękujemy za wybór naszej platformy i życzymy miłego korzystania z naszych usług.</p>
            <p>Zespół Obsługi Klienta FleetPRO</p>
          </body>
        </html>
    `;
  return template;
};
