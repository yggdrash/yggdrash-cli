import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.yggdrash.core.contract.TransactionReceipt;
import io.yggdrash.core.store.StateStore;
import io.yggdrash.core.store.TransactionReceiptStore;
import org.junit.Before;
import org.junit.Test;

import java.math.BigDecimal;

public class MetaCoinContractTest {
    private StateStore<BigDecimal> stateStore;
    private TransactionReceiptStore txReceiptStore;
    private MetaCoinContract coinContract = new MetaCoinContract();

    @Before
    public void setUp() {
        stateStore = new StateStore<>();
        txReceiptStore = new TransactionReceiptStore();
        coinContract.init(stateStore, txReceiptStore);
    }

    @Test
    public void genesis() {
        JsonArray params = new JsonArray();
        JsonObject param = new JsonObject();
        params.add(param);

        JsonObject alloc = new JsonObject();
        param.add("alloc", alloc);

        JsonObject frontier = new JsonObject();
        frontier.addProperty("balance", "1000000000");

        alloc.add("1a0cdead3d1d1dbeef848fef9053b4f0ae06db9e", frontier);

        TransactionReceipt receipt = coinContract.genesis(params);

        assert receipt.isSuccess();
        assert stateStore.get("1a0cdead3d1d1dbeef848fef9053b4f0ae06db9e")
                .equals(BigDecimal.valueOf(1000000000));

    }
}