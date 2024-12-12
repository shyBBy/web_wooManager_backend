

export const activationAccountMailTemplate = (activationCode: string) => {
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
            <p>Dziękujemy za rejestrację na naszej platformie. Aby dokończyć proces rejestracji i aktywować swoje konto, proszę wprowadzić poniższy kod aktywacyjny na stronie aktywacji konta. Otworz aplikacje raz jeszcze i wprowadź kod - jeśli nie masz okna aktywacyjnego kliknij po prosu "Zaloguj" i wprowadź dane, a system sam przeniesie Cię do aktywacji konta.
            
            <p><strong>Twój KOD AKTYWACYJNY: </strong>${activationCode}</p>
          </body>
        </html>
    `
    return template
}
