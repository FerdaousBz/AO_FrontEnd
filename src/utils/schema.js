import * as yup from 'yup';

const requiredPasswordMessage = 'Le password est obligatoire';
const requiredEmailMessage = "L'email est obligatoire";

export const signinSchema = yup.object().shape({
  email: yup.string().email().required(requiredEmailMessage),
  password: yup.string().required(requiredPasswordMessage),
});

export const profilSchema = yup.object().shape({
  email: yup.string().email().required(requiredEmailMessage),
  nom: yup.string().required('Le nom est obligatoire'),
  password: yup.string().required(requiredPasswordMessage),
  passwordConf: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Le confirmation de password est obligatoire'),
  prenom: yup.string().required('Le prenom est obligatoire'),
  telephone: yup.string().required('Le telephone est obligatoire'),
});

const customErrorMessages = {
  nom: {
    format: 'Le nom doit contenir uniquement des lettres',
    length: 'Le nom doit contenir au moins 2 caractères',
    required: 'Le nom est obligatoire',
  },
  prenom: {
    format: 'Le prénom doit contenir uniquement des lettres',
    length: 'Le prénom doit contenir au moins 2 caractères',
    required: 'Le prénom est obligatoire',
  },
  telephone: {
    phone: 'Le format du numéro de téléphone est invalide',
    required: 'Le téléphone est obligatoire',
  },
};
