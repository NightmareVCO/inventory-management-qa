/* (C)2025 */
package inventory.management.qa.server;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/java/resources/features",
        glue = "inventory.management.qa.server.steps",
        plugin = {"pretty", "html:target/cucumber-reports.html"})
@ActiveProfiles("test")
public class CucumberIntegrationTest {}
