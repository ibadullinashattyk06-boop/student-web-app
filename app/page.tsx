import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export default async function Home() {
  const messages = await sql`
    SELECT * FROM messages
    ORDER BY id DESC
  `;

  async function addMessage(formData: FormData) {
    'use server';

    const message = String(
      formData.get('message') ?? ''
    ).trim();

    if (!message) return;

    const db = neon(process.env.DATABASE_URL!);

    await db`
      INSERT INTO messages (message)
      VALUES (${message})
    `;

    revalidatePath('/');
  }

  return (
    <main style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }}>
      <h1>Менің алғашқы веб-қосымшам</h1>

      <p>
        Бұл қосымша Neon бұлттық деректер қорымен жұмыс істейді.
      </p>

      <form action={addMessage}>
        <input
          name="message"
          placeholder="Хабарлама енгізіңіз"
          required
          style={{
            padding: '12px',
            width: '70%',
            marginRight: '10px',
            backgroundColor: '#ffffff',
            color: '#111111',
            border: '1px solid #cccccc',
            borderRadius: '5px'
          }}
        />

        <button type="submit">Сақтау</button>
      </form>

      <h2>Хабарламалар тізімі</h2>

      {messages.map((item) => (
        <div key={item.id} style={{
          padding: '12px',
          marginTop: '10px',
          background: '#eeeeee',
          color: '#111111',
          borderRadius: '5px'
        }}>
          {item.message}
        </div>
      ))}
    </main>
  );
}
