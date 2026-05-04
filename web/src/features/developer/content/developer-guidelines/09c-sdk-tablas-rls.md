# 🗄️ SDK m4g-sdk — Tablas Supabase y políticas RLS

Para que el SDK funcione necesitas tres tablas en tu proyecto Supabase y sus políticas RLS correspondientes.

> [!IMPORTANT]
> Estas tablas ya existen en el Supabase de producción de M4G. Solo debes crearlas manualmente si trabajas con un proyecto Supabase propio para pruebas locales.

## Tablas requeridas

### `matches` — Registro de partidas

```sql
CREATE TABLE matches (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id    uuid NOT NULL REFERENCES games(id),
  player_1   uuid NOT NULL REFERENCES profiles(id),
  player_2   uuid REFERENCES profiles(id),
  player_3   uuid,
  player_4   uuid,
  winner_id  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  loser_id   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status     text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `scores` — ELO por jugador y juego

```sql
CREATE TABLE scores (
  user_id      uuid REFERENCES profiles(id),
  game_id      uuid REFERENCES games(id),
  score        integer DEFAULT 1000,
  games_played integer DEFAULT 0,
  PRIMARY KEY (user_id, game_id)
);
```

> [!WARNING]
> La clave primaria compuesta `(user_id, game_id)` es **obligatoria**. Sin ella `submitEloResult` no puede ejecutar el upsert y fallará con un error de constraint.

### `match_movements` — Movimientos por turno

```sql
CREATE TABLE match_movements (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id         uuid REFERENCES matches(id),
  player_id        uuid REFERENCES profiles(id),
  move_data        jsonb,
  server_timestamp timestamptz
);
```

---

## Políticas RLS

El SDK usa la **anon key** de Supabase. Las siguientes políticas son el mínimo necesario:

```sql
-- ─── matches ──────────────────────────────────────────────────────────────────
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_insert" ON matches
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "matches_update" ON matches
  FOR UPDATE TO anon USING (true);

-- ─── scores ───────────────────────────────────────────────────────────────────
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scores_select" ON scores
  FOR SELECT TO anon USING (true);

CREATE POLICY "scores_insert" ON scores
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "scores_update" ON scores
  FOR UPDATE TO anon USING (true);

-- ─── match_movements ──────────────────────────────────────────────────────────
ALTER TABLE match_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "movements_insert" ON match_movements
  FOR INSERT TO anon WITH CHECK (true);
```

> [!CAUTION]
> Las políticas anteriores usan `WITH CHECK (true)` para facilitar el desarrollo. En producción sustitúyelas por condiciones más restrictivas que validen que el `player_id` coincide con el usuario autenticado.

> [!NOTE]
> Si tus juegos usan sesión autenticada de Supabase (JWT), cambia `TO anon` por `TO authenticated` y añade condiciones como `auth.uid() = player_id`.

---

## Errores comunes

| Error | Causa probable | Solución |
| ----- | -------------- | -------- |
| `insert violates row-level security` | Falta policy INSERT | Añadir la policy para la tabla afectada |
| `duplicate key value violates unique constraint` | Falta PRIMARY KEY en `scores` | Añadir `PRIMARY KEY (user_id, game_id)` |
| ELO no cambia tras la partida | `submitEloResult` llamado por varios jugadores | Implementar patrón host-only |
| `column "game_id" does not exist` | Tabla incompleta | Revisar el DDL completo de la tabla |
