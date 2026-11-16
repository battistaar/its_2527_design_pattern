import * as fs from 'fs';

interface DataSource {
    readData(): Buffer;
    writeData(data: Buffer): void;
}

class FileDataSource implements DataSource {
    readData(): Buffer {
        return fs.readFileSync('/test');
    }
    writeData(data: Buffer): void {
        fs.writeFileSync(data, '/test');
    }
}


abstract class DataSourceDecorator implements DataSource {
    private base: DataSource;

    constructor(base: DataSource) {
        this.base = base;
    }

    readData(): Buffer {
        return this.base.readData();
    }

    writeData(data: Buffer): void {
        this.base.writeData(data);
    }

}

const noop = (data: Buffer): Buffer => {
    return data;
}

const decrypt = noop;
const encrypt = noop;
const compress = noop;
const decompress = noop;

class EncryptionDecorator extends DataSourceDecorator {
    readData(): Buffer {
        const data = super.readData();

        const decrypted = decrypt(data);
        return decrypted;
    }

    writeData(data: Buffer): void {
        this.writeData(encrypt(data));
    }
}

