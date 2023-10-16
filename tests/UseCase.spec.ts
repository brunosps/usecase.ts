import { UseCase } from "../src";
import { ApplicationError, RegistraUsuario, RegistraUsuarioOutPut, SyncSSO, UsuarioDto } from "./support";


describe('Use Case Test', () => {


    it('RegistraUsuario.call to be truthy', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" });

        expect(result.isSuccess()).toBeTruthy();
        expect(result.data).toEqual({ id: 1 })
        expect(result.context).toEqual({ nome: 'Bruno', id: 1 })
    });

    it('RegistraUsuario.call to be falsy', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" });

        expect(result.isSuccess()).toBeFalsy();
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error).toBeInstanceOf(ApplicationError)
        expect(result.error.message).toBe("Deu errado")
    });

    it('RegistraUsuario.call with Sync to be truthy', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" })
            .andThen<{ syncUser: boolean }>((data, res) => {
                return SyncSSO.call({
                    email: "bruno@bruno.com",
                    id: data.id,
                    nome: `${res.getContext().nome}`,
                });
            })

        expect(result.data).toEqual({ syncUser: true });
        expect(result.context).toEqual({
            "email": "bruno@bruno.com",
            "id": 1,
            "nome": "Bruno",
            "syncUser": true,
        });
        expect(result.isSuccess()).toBeTruthy();

    });

    it('RegistraUsuario.call with Sync to be falsy in name', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "" })
            .andThen<{ syncUser: boolean }>((data, res) => {
                return SyncSSO.call({
                    email: "bruno@bruno.com",
                    id: data.id,
                    nome: `${res.getContext().nome}`,
                });
            })


        expect(result.isSuccess()).toBeFalsy();
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error).toBeInstanceOf(ApplicationError)
        expect(result.error.message).toBe("Deu errado")
    });

    it('RegistraUsuario.call with Sync to be falsy in email', () => {
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" })
            .andThen<{ syncUser: boolean }>((data, res) => {
                return SyncSSO.call({
                    email: "bruno.com",
                    id: data.id,
                    nome: `${res.getContext().nome}`,
                });
            })


        expect(result.isSuccess()).toBeFalsy();
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error).toBeInstanceOf(ApplicationError)
        expect(result.error.message).toBe("Deu errado")
    });

    it('RegistraUsuario.call with Sync onSuccess', () => {
        let dataResult = {};
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" })
            .andThen<{ syncUser: boolean }>((data, res) => {
                return SyncSSO.call({
                    email: "bruno@bruno.com",
                    id: data.id,
                    nome: `${res.getContext().nome}`,
                });
            }).onSuccess((data, res) => {
                dataResult = res.data;
            })
            .onFailure((errors, res) => {
                console.log("Atributos inválidos", errors);
            }, "INVALID_ATTRIBUTE")
            .onFailure((errors, res) => console.log("Erro não esperado", errors));

        expect(result.data).toEqual(dataResult);
        expect(result.context).toEqual({
            "email": "bruno@bruno.com",
            "id": 1,
            "nome": "Bruno",
            "syncUser": true,
        });
        expect(result.isSuccess()).toBeTruthy();
    });

    it('RegistraUsuario.call with Sync onFailure', () => {
        let resultError;
        const result = RegistraUsuario.call<UsuarioDto, RegistraUsuarioOutPut>({ nome: "Bruno" })
            .andThen<{ syncUser: boolean }>((data, res) => {
                return SyncSSO.call({
                    email: "bruno@bruno.com",
                    id: data.id,
                    nome: "",
                });
            }).onSuccess((data, res) => {
                console.log("201", res.data);
                return true;
            })
            .onFailure((error, res) => {
                resultError = error;
            }, "INVALID_ATTRIBUTE")
            .onFailure((errors, res) => console.log("Erro não esperado", errors));

        expect(result.isSuccess()).toBeFalsy();
        expect(result.error).toEqual(resultError)
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error).toBeInstanceOf(ApplicationError)
        expect(result.error.message).toBe("Deu errado")
    });

    it('UseCase Exception on Execute Method', () => {
        let resultError;
        const useCase = new UseCase<UsuarioDto, RegistraUsuarioOutPut>

        try {
            useCase.execute({ nome: "Bruno" });
        } catch (e: any) {
            resultError = e;
        }

        expect(resultError.message).toEqual('Method not implemented.');
        expect(resultError).toBeInstanceOf(Error)

    });

})