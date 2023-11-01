import { render, screen, fireEvent } from '@testing-library/react';
const SignUp = require('../src/pages/User/Signup'); // Importation du composant Signup

test('validationEmail valide une adresse e-mail correcte', () => {
  render(<SignUp />);
  
  // Sélectionnez l'élément de saisie de l'e-mail
  const emailInput = screen.getByLabelText('e-mail');
  
  // Simulez la saisie d'une adresse e-mail valide
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Sélectionnez le bouton "S'inscrire" et soumettez le formulaire
  const submitButton = screen.getByText("S'inscrire");
  fireEvent.click(submitButton);
  
  // Vérifiez que le message d'erreur n'est pas affiché (email valide)
  const errorToast = screen.queryByText("Adresse e-mail invalide.");
  expect(errorToast).toBeNull();
});

test('validationEmail invalide une adresse e-mail incorrecte', () => {
  render(<SignUp />);
  
  // Sélectionnez l'élément de saisie de l'e-mail
  const emailInput = screen.getByLabelText('e-mail');
  
  // Simulez la saisie d'une adresse e-mail incorrecte
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  
  // Sélectionnez le bouton "S'inscrire" et soumettez le formulaire
  const submitButton = screen.getByText("S'inscrire");
  fireEvent.click(submitButton);
  
  // Vérifiez que le message d'erreur est affiché (email invalide)
  const errorToast = screen.getByText("Adresse e-mail invalide.");
  expect(errorToast).toBeInTheDocument();
});
