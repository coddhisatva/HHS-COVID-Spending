I wanted to dive into the federal account data from usaspending.gov, so I started with HHS Covid-related Allocation and De-allocation in 2025 (most recent period available).

Website to access this data: https://www.usaspending.gov/download_center/custom_account_data

Upon reaching the website, there are many parameters to select, to filter the data you receive. Below are the parameters I selected for this initial project (and why), for purposes of insight and replication:

| PARAMETER | SELECTED | REASONING |
Budget Function | All | To capture everything
Agency | Department of Health and Human Services | Covid related spending would fall in this domain, and the HHS is of interest to me
Federal Account | All | To capture everything
Account level | Federal Account | To maximize data by including aggregate of treasury accounts
File Type | Account Breakdown by Reward | I initially ran a download for all 3 options here, but Account Breakdown by Reward provides the most detailed insights, which separate into 3 further categories -- contract, financial assistance, and unlinked -- all of which I've captured to start out with

Data is provided in csv files, which I've added to this repo.