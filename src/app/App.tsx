import { Grapher } from '../features/grapher';
import { copy } from './copy';

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-gray-600">{copy.description}</p>
        </header>
        <Grapher />
      </div>
    </main>
  );
}
