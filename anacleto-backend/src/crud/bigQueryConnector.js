const { BigQuery } = require('@google-cloud/bigquery');

/**
 * Connector for Google BigQuery datawarehouse
 */
class BigQueryConnector {

    constructor() {
        if (!env.BIGQUERY_SETTINGS) {
            logger.info("No BIGQUERY_CONNECTIONS property found in .env");
            return;
        }

        this.bigqueryClient = new BigQuery();
        this.bigQueryConections = JSON.parse(env.BIGQUERY_SETTINGS);
    }

    /**
     * Runs a BigQuery SQL query asynchronously and returns query results if the query completes within a specified timeout.
     * @param {*} bigquery connection Name
     * @param {query,pageToken} args For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
     */
    query(bigquery, args) {
        const connection = bigquery ? bigQueryConections[bigquery] : null;
        if (!connection && bigquery) {
            throw `BigQuery connection to "${bigquery}" not found`;
        }

        // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
        const options = Object.assign({
            location: connection.location, //ex europe-west2, location must match that of the dataset(s) referenced in the query.
            defaultDataset: connection.defaultDataset // ex {"datasetId": "my_scheme","projectId": "my-gcp-project"}
        }, args);

        // Run the query as a job

        bigquery.createQueryJob(options)
            .then(job => {
                console.log(`Job ${job.id} started.`);
                return job.getQueryResults();
            });
    }


}

module.exports = new BigQueryConnector();