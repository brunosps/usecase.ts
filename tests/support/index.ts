import { Failure, Result, Success, UseCase } from "../../src";

export class UsuarioDto {
    id?: number;
    nome: string;

    constructor(id: number, nome: string) {
        this.id = id
        this.nome = nome
    }
}

export class RegistraUsuarioOutPut {
    id: number;
    constructor(id: number) {
        this.id = id
    }
}

export class RegistraUsuario extends UseCase<UsuarioDto, RegistraUsuarioOutPut> {
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

export class SyncSSODto {
    email: string;
    nome: string;

    constructor(email: string, nome: string) {
        this.email = email
        this.nome = nome
    }
}

export class NormalizeAndValidateSSO extends UseCase<SyncSSODto, SyncSSODto> {
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
        return true;
    }
}

export class DoSyncSSO extends UseCase<SyncSSODto, { syncUser: boolean }> {
    execute(input: SyncSSODto): Result<{ syncUser: boolean }> {
        return Success({ syncUser: true });
    }
}

export class SyncSSO extends UseCase<SyncSSODto, { syncUser: boolean }> {
    execute(input: SyncSSODto): Result<{ syncUser: boolean }> {
        return this.call<SyncSSODto, SyncSSODto>(
            NormalizeAndValidateSSO,
            input
        ).andThen<{ syncUser: boolean }>((data: SyncSSODto) => {
            return DoSyncSSO.call(data);
        });
    }
}