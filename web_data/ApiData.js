export class ApiData {
    static baseUrl = 'https://localhost:7047';
    static userBaseUrl = `${this.baseUrl}/api/User`
    static url = {
        user: {
            getAccount: `${this.userBaseUrl}/account`,
            createUser: this.userBaseUrl,
        }
    }
    static method = {
        post: "POST",
        put: "PUT",
        delete: "DELETE",
        get: "GET",
    }
    static apiConfig = (loginData, med) => {
        return {
            method: med,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        }
    }
    static async getAccount(email, password) {
        const loginData = {email, password}
        try {
            const response = await fetch(this.url.user.getAccount,this.apiConfig(loginData, this.method.post));
            console.log('get account successfull');
            return await response.json();
            
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async register(param){
        try {
            const response = await fetch(this.url.user.createUser, this.apiConfig(param, this.method.post));
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}