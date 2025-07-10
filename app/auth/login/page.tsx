import EmailSignInForm from '@/components/auth/EmailSignInForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-transparent flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded shadow'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Connexion à Katalyx Proposals
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Entrez votre adresse email pour recevoir un lien de connexion
            sécurisé.
          </p>
        </div>
        <EmailSignInForm />
      </div>
    </div>
  );
}
