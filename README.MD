# UseCase.ts

## Inspired by [u-case](https://github.com/serradura/u-case)

## Using

Firstly we have to create input class

```typescript
class UsuarioDto {
  id?: number;
  nome: string;
}
```

After we have to create output class

```typescript
class RegistraUsuarioOutPut {
  id: number;
}
```

Lastly we have to create the use case class

```typescript
class RegistraUsuario extends UseCase<UsuarioDto, RegistraUsuarioOutPut> {
  execute(input: UsuarioDto): Result<RegistraUsuarioOutPut> {
    if (!input.nome || input.nome === "") {
      return Failure(
        { property: "nome", errors: ["Nome é obrigatório"] },
        "INVALID_ATTRIBUTE"
      );
    }

    return Success({ id: 1 });
  }
}
```

To use the use case class just execute the call method passing the appropriate parameters

```typescript
RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" })
  .onSuccess((data, res) => {
    console.log("201", res.data);
  })
  .onFailure((errors, res) => {
    console.log("Atributos inválidos", errors);
  }, "INVALID_ATTRIBUTE")
  .onFailure((errors, res) => console.log("Erro não esperado", errors));
```

Output

```bash
[LOG]: "201",  {
    "id": 1
}
```

This way the onSuccess block will be executed, if the name was blank, the use case would fail and the onFailure block would be executed

```typescript
RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" })
  .onSuccess((data, res) => {
    console.log("201", res.transitions);
  })
  .onFailure((errors, res) => {
    console.log("Atributos inválidos", errors);
  }, "INVALID_ATTRIBUTE")
  .onFailure((errors, res) => console.log("Erro não esperado", errors));
```

Output

```bash
[LOG]: "Atributos inválidos",  {
  "property": "nome",
  "errors": [
    "Nome é obrigatório"
  ]
}
```

### Chaining things(or cases)

```typescript
class SyncSSODto {
  email: string;
  nome: string;
}
```

```typescript
class NormalizeAndValidateSSO extends UseCase<SyncSSODto, SyncSSODto> {
  execute(input: SyncSSODto): Result<SyncSSODto> {
    if (!input.nome || input.nome === "") {
      return Failure(
        { property: "nome", errors: ["Nome é obrigatório"] },
        "INVALID_ATTRIBUTE"
      );
    }

    if (!this.isEmail(input.email)) {
      return Failure({ property: "email", errors: ["Email inválido"] });
    }

    const nome = input.nome.trim();
    const email = input.email.trim();

    return Success({ nome, email });
  }

  private isEmail(email: string) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  }
}
```

```typescript
class DoSyncSSO extends UseCase<SyncSSODto, { syncUser: boolean }> {
  execute(input: SyncSSODto): Result<{ syncUser: boolean }> {
    return Success({ syncUser: true });
  }
}
```

```typescript
class SyncSSO extends UseCase<SyncSSODto, { syncUser: boolean }> {
  execute(input: SyncSSODto): Result<{ syncUser: boolean }> {
    return this.call<SyncSSODto, SyncSSODto>(
      NormalizeAndValidateSSO,
      input
    ).andThen<{ syncUser: boolean }>((data: SyncSSODto) => {
      return DoSyncSSO.call(data);
    });
  }
}
```

andThen

```typescript
RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" })
  .andThen<{ syncUser: boolean }>((data, res) => {
    return SyncSSO.call({
      email: "bruno@bruno.com",
      id: data.id,
      nome: `${res.getContext().nome}`,
    });
  })
  .onSuccess((data, res) => {
    console.log("201", res.data);
  })
  .onFailure((errors, res) => {
    console.log("Atributos inválidos", errors);
  }, "INVALID_ATTRIBUTE")
  .onFailure((errors, res) => console.log("Erro não esperado", errors));
```
