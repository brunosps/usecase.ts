import { Failure, Result, Success, UseCase } from "../../src";

class BaseError extends Error {
    constructor(message: string) {
        super();
        const constructorName = this.constructor.name;
        this.name = constructorName;
        this.message = message;
    }
}

export class ApplicationError extends BaseError {
    public readonly errors: any;
    constructor(message: string, errors?: any) {
        super(message);
        this.errors = errors;
    }
}

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
                new ApplicationError('Deu errado', { property: "nome", errors: ["Nome é obrigatório"] }),
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
                new ApplicationError('Deu errado', { property: "nome", errors: ["Nome é obrigatório"] }),
                "INVALID_ATTRIBUTE"
            );
        }

        if (!this.isEmail(input.email)) {
            return Failure(new ApplicationError('Deu errado', { property: "email", errors: ["Email inválido"] }));
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